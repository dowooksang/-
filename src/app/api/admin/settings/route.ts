// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/settings
 * 관리자가 직접 수정하는 누적정기공연수, 수도권 거점 수 등 설정 지표를 데이터베이스에서 가져옵니다.
 * 만약 site_settings 테이블이 생성되지 않은 상태라면, 시스템 중단을 막기 위해 기본 하드코딩 수치(Fallback)를 안전하게 반환합니다.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) {
      console.warn('site_settings 조회 실패 (테이블 미생성 가능성 있음):', error.message);
      // Fallback 기본값 반환
      return NextResponse.json({
        cumulative_concerts: '320',
        metro_hubs: '5'
      }, { status: 200 });
    }

    const settings: Record<string, string> = {
      cumulative_concerts: '320', // default fallback
      metro_hubs: '5'            // default fallback
    };

    if (data && Array.isArray(data)) {
      data.forEach((row: any) => {
        settings[row.key] = row.value;
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    console.error('API Settings GET error:', err);
    return NextResponse.json({
      cumulative_concerts: '320',
      metro_hubs: '5'
    }, { status: 200 });
  }
}

/**
 * POST /api/admin/settings
 * 관리자 대시보드에서 입력한 지표 값들을 site_settings 테이블에 upsert 처리합니다.
 */
export async function POST(request: Request) {
  try {
    const { cumulative_concerts, metro_hubs } = await request.json();

    if (cumulative_concerts === undefined || metro_hubs === undefined) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }

    const updates = [
      { key: 'cumulative_concerts', value: String(cumulative_concerts) },
      { key: 'metro_hubs', value: String(metro_hubs) }
    ];

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      console.error('site_settings upsert 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('API Settings POST error:', err);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}
