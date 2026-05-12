import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  try {
    const users = db.getUsers();
    // 비밀번호 필터링
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return NextResponse.json(safeUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
