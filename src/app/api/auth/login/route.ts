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
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const user = data.user;
    // 세션 토큰 등은 클라이언트에서 직접 관리하도록 하고, 여기서는 email 쿠키만 설정
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        // user_metadata에 nickname, name 등 추가 정보가 있을 수 있음
        ...(user.user_metadata || {}),
      },
      { status: 200 }
    );

    response.cookies.set('email', user.email, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

