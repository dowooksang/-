import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: '이메일 파라미터가 필요합니다.' }, { status: 400 });
    }

    const user = db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: '존재하지 않는 회원입니다.' }, { status: 404 });
    }

    // 비밀번호 필드는 안전하게 제거하여 반환
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
