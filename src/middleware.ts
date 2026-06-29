import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // 1. 응답 객체 생성
  const response = NextResponse.next();

  // 2. 환경 변수 검증
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const pathname = request.nextUrl.pathname;

  // /super/storage는 /admin/vault로 302 리다이렉션 처리
  if (pathname === '/super/storage') {
    return NextResponse.redirect(new URL('/admin/vault', request.url));
  }

  const isAdminMeeting = pathname.startsWith('/admin/meeting');
  const isAdminVault = pathname.startsWith('/admin/vault');

  // 3. 브라우저 쿠키로부터 세션 토큰 읽기
  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;

  let sessionUser: any = null;
  let userLevel: number = 0;

  if (accessToken && refreshToken) {
    // 4. 격리된 Supabase 클라이언트 임시 생성 (미들웨어용)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    try {
      // 5. Supabase 세션 설정 및 체크
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // 6. 세션이 유효하고, 갱신되었거나 정상인 경우 쿠키를 다시 구워 동기화 보장
      if (!error && session) {
        sessionUser = session.user;

        response.cookies.set('sb-access-token', session.access_token, {
          path: '/',
          maxAge: 604800, // 7일
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        response.cookies.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          maxAge: 2592000, // 30일
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        if (session.user?.email) {
          response.cookies.set('email', encodeURIComponent(session.user.email), {
            path: '/',
            maxAge: 604800,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        }

        // 특정 관리자 전용 경로 접근 시에만 유저 등급(Level) 추가 체크 수행
        if (isAdminMeeting || isAdminVault) {
          const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('level')
            .eq('id', session.user.id)
            .single();

          if (!dbError && dbUser) {
            userLevel = dbUser.level ?? 1;
          }
        }
      } else if (error) {
        // 만약 세션 복구에 실패한 경우(토큰 만료 등), 기존 세션 쿠키 삭제하여 동기화
        response.cookies.delete('sb-access-token');
        response.cookies.delete('sb-refresh-token');
        response.cookies.delete('email');
      }
    } catch (e) {
      console.error('Middleware session refresh/check error:', e);
    }
  }

  // 7. 특정 보안 공간 권한 통제 (이중 보안 1단계)
  if (isAdminMeeting || isAdminVault) {
    let isAuthorized = false;
    if (sessionUser) {
      if (isAdminMeeting && userLevel >= 5) {
        isAuthorized = true;
      } else if (isAdminVault && userLevel === 6) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      // 비인가 권한의 경우 메인 화면으로 리다이렉트
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

// matcher 설정: 정적 리소스 및 파비콘 등을 제외한 전역 경로에 미들웨어 작동 보장
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};