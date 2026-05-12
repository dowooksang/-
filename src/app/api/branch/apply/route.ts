import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, managerName, managerPhone, region, hasPracticeRoom, bandCount, userId } = body;

    if (!name || !managerName || !managerPhone || !region || typeof hasPracticeRoom !== 'boolean' || typeof bandCount !== 'number' || !userId) {
      return NextResponse.json({ error: '모든 항목을 올바르게 입력해주세요.' }, { status: 400 });
    }

    try {
      const newBranch = db.addBranch({
        name,
        managerName,
        managerPhone,
        region,
        hasPracticeRoom,
        bandCount,
        userId
      });
      return NextResponse.json(newBranch, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 500 });
  }
}
