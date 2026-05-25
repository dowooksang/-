import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { userId, level } = await request.json();
    
    if (!userId || !level) {
      return NextResponse.json({ error: '회원 ID와 변경할 등급이 필요합니다.' }, { status: 400 });
    }

    const success = db.changeUserLevel(userId, level);
    
    if (success) {
      return NextResponse.json({ message: '등급이 변경되었습니다.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: '등급 변경 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
