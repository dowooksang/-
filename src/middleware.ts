import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { UserLevel } from '@/lib/store';

/**
 * Role‑based access middleware.
 *
 * - `/branch/**` 와 `/network/**` 페이지는 지부장(LV4_MANAGER) 이상만 접근 가능.
 * - 클라이언트는 로그인 시 `email` 쿠키(또는 세션 쿠키)를 설정한다고 가정합니다.
 * - 쿠키가 없거나 사용자를 찾을 수 없으면 메인 페이지로 리다이렉트하고, 권한이 부족하면
 *   동일하게 메인 페이지에 `?error=unauthorized` 쿼리 파라미터를 붙여 리다이렉트합니다.
 * - Supabase에서 사용자 정보를 비동기로 조회하고, `level` 필드를 검증합니다.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호가 필요한 경로만 처리 (matcher에서도 지정하지만 명시적으로 확인)
  const protected = pathname.startsWith('/branch') || pathname.startsWith('/network');
  if (!protected) return NextResponse.next();

  // 1️⃣ 쿠키에서 이메일을 추출 (로그인 시 쿠키에 저장된다고 가정)
  const email = request.cookies.get('email')?.value;
  if (!email) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '?error=unauthenticated';
    return NextResponse.redirect(redirectUrl);
  }

  // 2️⃣ Supabase 에서 사용자 조회 (비동기)
  const { data: user, error } = await supabase
    .from('users')
    .select('level')
    .eq('email', email)
    .single();

  if (error || !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '?error=user-not-found';
    return NextResponse.redirect(redirectUrl);
  }

  // 3️⃣ 권한 체크 – LV4_MANAGER(4) 이상이어야 함
  const userLevel = Number(user.level);
  if (userLevel < UserLevel.LV4_MANAGER) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '?error=unauthorized';
    return NextResponse.redirect(redirectUrl);
  }

  // 모든 검증을 통과했으면 정상 진행
  return NextResponse.next();
}

// Next.js 13+ 에서 matcher 로 보호 경로를 지정합니다.
export const config = {
  matcher: ['/branch/:path*', '/network/:path*'],
};
