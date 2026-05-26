// 현재 사용자 조회 API – Supabase 기반 구현
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: '이메일 파라미터가 필요합니다.' }, { status: 400 });
    }

    // Supabase에서 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '존재하지 않는 회원입니다.' }, { status: 404 });
    }

    // 비밀번호 제외하고 반환
    const { password, ...safeUser } = user as any;
    return NextResponse.json(safeUser, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
