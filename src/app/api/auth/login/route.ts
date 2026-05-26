// 로그인 API – Supabase users 테이블 기반 구현
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // users 테이블에서 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, nickname, name, level, status')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증 (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password ?? '');
    if (!isMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 성공 응답 + 쿠키 설정 (email)
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

