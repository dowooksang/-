import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '회원 ID가 필요합니다.' }, { status: 400 });
    }

    const success = await db.dismissAdmin(userId);
    
    if (success) {
      return NextResponse.json({ message: '관리자에서 해임되었습니다.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: '회원을 찾을 수 없거나 이미 관리자가 아닙니다.' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: '해임 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
