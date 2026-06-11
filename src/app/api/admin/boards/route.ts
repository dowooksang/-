// src/app/api/admin/boards/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// 하드코딩 기본 Fallback 권한 설정
const DEFAULT_PERMISSIONS = [
  { category: 'notice', read_level: 1, write_level: 5 },
  { category: 'free', read_level: 2, write_level: 2 },
  { category: 'greeting', read_level: 1, write_level: 1 },
  { category: 'promotion', read_level: 2, write_level: 2 },
  { category: 'market', read_level: 2, write_level: 2 },
  { category: 'archive', read_level: 2, write_level: 2 },
  { category: 'qa', read_level: 1, write_level: 1 },
  { category: 'press', read_level: 1, write_level: 5 },
  { category: 'event', read_level: 1, write_level: 5 }
];

/**
 * GET /api/admin/boards
 * 각 게시판 카테고리별 읽기/쓰기 등급 권한 목록을 조회합니다.
 * 테이블이 없는 상태라면 fallback 기본값을 반환합니다.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('board_permissions')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.warn('board_permissions 조회 실패 (테이블 미생성 가능성 있음):', error.message);
      return NextResponse.json(DEFAULT_PERMISSIONS, { status: 200 });
    }

    // 데이터가 비어있다면 초기값 생성하여 반환
    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_PERMISSIONS, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('API Boards GET error:', err);
    return NextResponse.json(DEFAULT_PERMISSIONS, { status: 200 });
  }
}

/**
 * POST /api/admin/boards
 * 게시판별 읽기/쓰기 권한 설정을 DB에 저장(upsert)합니다.
 */
export async function POST(request: Request) {
  try {
    const { permissions } = await request.json();

    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ error: '올바르지 않은 요청 본문입니다.' }, { status: 400 });
    }

    // upsert 데이터 구성
    const updates = permissions.map((item: any) => ({
      category: item.category,
      read_level: Number(item.read_level),
      write_level: Number(item.write_level),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('board_permissions')
      .upsert(updates, { onConflict: 'category' });

    if (error) {
      console.error('board_permissions upsert 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('API Boards POST error:', err);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}
