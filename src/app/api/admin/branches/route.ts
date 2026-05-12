import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  try {
    const branches = db.getBranches();
    return NextResponse.json(branches, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
