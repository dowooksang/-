import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nickname, position } = body;

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    try {
      const newUser = db.addUser({
        email,
        password,
        nickname,
        position: position || '보컬'
      });
      // 성공적으로 가입 (비밀번호는 제외하고 반환)
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 500 });
  }
}
