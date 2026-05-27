import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. custom users 테이블에서 유저 조회
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

    // 2. 암호화된 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password ?? '');
    if (!isMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. 성공 응답 생성 및 쿠키 굽기 (Supabase Auth 중복 호출 제거!)
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
