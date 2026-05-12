import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { branchId } = await request.json();
    
    if (!branchId) {
      return NextResponse.json({ error: '지부 ID가 필요합니다.' }, { status: 400 });
    }

    const success = db.approveBranch(branchId);
    
    if (success) {
      return NextResponse.json({ message: '승인되었습니다.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: '지부를 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: '승인 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
