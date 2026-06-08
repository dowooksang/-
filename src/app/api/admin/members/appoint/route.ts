import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '회원 ID가 필요합니다.' }, { status: 400 });
    }

    const success = await db.appointAdmin(userId);
    
    if (success) {
      return NextResponse.json({ message: '관리자로 임명되었습니다.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: '임명 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
