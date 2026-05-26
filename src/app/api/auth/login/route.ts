import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Supabase에서 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, level, status, nickname, name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password ?? '');
    if (!isMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // Supabase Auth 세션 생성 (자동 쿠키 발행)
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInErr) {
      return NextResponse.json({ error: signInErr.message }, { status: 401 });
    }

    // 응답에 쿠키와 사용자 정보 포함
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        name: user.name,
        level: user.level,
        status: user.status,
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
