// 회원가입 API – Supabase 기반 구현
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      nickname,
      name,
      phone,
      bandName,
      position,
      address,
    } = await request.json();

    // 필수 항목 검증
    if (!email || !password || !name || !phone || !position || !address) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    // 비밀번호 해시
    const hashedPwd = await bcrypt.hash(password, 10);

    // Supabase에 사용자 삽입
    const { data, error } = await supabase.from('users').insert({
      email,
      password: hashedPwd,
      nickname: nickname || name,
      name,
      phone,
      band_name: bandName || '소속 없음',
      position,
      address,
      status: 'pending',
      level: 1, // LV1_GUEST
    }).single();

    if (error) {
      // 예: 중복 이메일
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // 비밀번호 제거하고 응답
    const { password: _, ...userWithoutPassword } = data as any;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 500 });
  }
}
