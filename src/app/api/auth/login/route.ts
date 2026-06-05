import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // Supabase Auth 사용해 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      console.error('Supabase 로그인 에러:', error?.message, error);
      return NextResponse.json(
        { error: error?.message || '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }
    const user = data.user;
    // 응답 본문에 필요한 사용자 정보만 반환
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        ...(user.user_metadata || {}),
      },
      { status: 200 }
    );
    // Set Supabase session cookies (httpOnly for 보안)
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    // **핵심 수정** – UI에서 읽을 수 있게 httpOnly 를 false 로 설정
    response.cookies.set('email', user.email, {
      httpOnly: false, // ← 클라이언트가 읽을 수 있도록
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (e) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}