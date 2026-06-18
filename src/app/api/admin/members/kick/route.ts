import { createServerSupabase } from '@/lib/supabaseServer';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { UserLevel } from '@/lib/userLevel';

export async function POST(request: Request) {
  try {
    const client = await createServerSupabase();
    
    // 1. 요청자(관리자) 세션 복구 및 권한 조회
    const { data: { user }, error: authError } = await client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요한 요청입니다.' }, { status: 401 });
    }

    const { data: requester, error: reqError } = await client
      .from('users')
      .select('level')
      .eq('id', user.id)
      .single();

    if (reqError || !requester || requester.level < UserLevel.LV5_ADMIN) {
      return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 });
    }

    // 2. 강제 탈퇴 대상 유저 ID 검증
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: '강제 탈퇴 대상 회원 ID가 필요합니다.' }, { status: 400 });
    }

    // 자기 자신 강제 탈퇴 방지
    if (userId === user.id) {
      return NextResponse.json({ error: '본인 계정은 강제 탈퇴 처리할 수 없습니다.' }, { status: 400 });
    }

    // 대상 유저 레벨 확인 (보안: 본인보다 높거나 같은 등급의 관리자 강제 탈퇴 불가)
    const { data: targetUser, error: targetError } = await client
      .from('users')
      .select('level')
      .eq('id', userId)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: '탈퇴 처리할 회원을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (targetUser.level >= requester.level) {
      return NextResponse.json({ error: '자신과 같거나 높은 등급의 회원은 강제 탈퇴 처리할 수 없습니다.' }, { status: 403 });
    }

    // 3. public.users 테이블에서 대상 회원 정보 삭제
    // 외래 키 ON DELETE SET NULL 동작으로 posts 및 comments 보존
    const { error: dbError } = await client
      .from('users')
      .delete()
      .eq('id', userId);

    if (dbError) {
      console.error('DB 회원 강제 탈퇴 삭제 실패:', dbError.message);
      return NextResponse.json({ error: '회원 DB 정보 삭제 실패: ' + dbError.message }, { status: 500 });
    }

    // 4. Supabase Auth (auth.users) 계정 강제 삭제
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!serviceKey) {
      console.error('⚠️ SUPABASE_SERVICE_ROLE_KEY 환경 변수가 정의되어 있지 않습니다.');
      return NextResponse.json({ error: '서버 환경 변수(Service Role Key) 설정 오류' }, { status: 500 });
    }

    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('Auth 회원 계정 강제 삭제 실패:', deleteAuthError.message);
      return NextResponse.json({ error: '인증 계정 삭제 실패: ' + deleteAuthError.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: '회원을 성공적으로 강제 탈퇴 처리했습니다.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('회원 강제 탈퇴 처리 중 내부 오류 발생:', error);
    return NextResponse.json(
      { error: '회원 강제 탈퇴 처리 중 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
