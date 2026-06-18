import { createServerSupabase } from '@/lib/supabaseServer';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const client = await createServerSupabase();
    
    // 쿠키를 사용하여 현재 로그인한 사용자 정보 조회
    const { data: { user }, error: authError } = await client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요한 요청입니다.' }, { status: 401 });
    }

    const userId = user.id;

    // 1. public.users 테이블에서 회원 삭제
    // 외래 키 제약 조건으로 인해 posts.author_id 및 comments.user_id는 ON DELETE SET NULL로 되어 있어
    // 해당 글과 댓글의 데이터는 보존되고 글쓴이 참조 값만 NULL로 초기화됩니다.
    const { error: dbError } = await client
      .from('users')
      .delete()
      .eq('id', userId);

    if (dbError) {
      console.error('DB 회원 삭제 실패:', dbError.message);
      return NextResponse.json({ error: '회원 DB 정보 삭제 실패: ' + dbError.message }, { status: 500 });
    }

    // 2. Supabase Auth (auth.users) 계정 삭제 (Service Role Key 필요)
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
      console.error('Auth 회원 계정 삭제 실패:', deleteAuthError.message);
      return NextResponse.json({ error: '인증 계정 삭제 실패: ' + deleteAuthError.message }, { status: 500 });
    }

    // 3. 로그아웃 쿠키 강제 파기 처리
    const response = NextResponse.json(
      { success: true, message: '회원 탈퇴 처리가 완료되었습니다.' },
      { status: 200 }
    );

    // sb-access-token 쿠키 만료
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    // sb-refresh-token 쿠키 만료
    response.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    // email 쿠키 만료
    response.cookies.set('email', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error('회원 탈퇴 처리 중 내부 오류 발생:', error);
    return NextResponse.json(
      { error: '회원 탈퇴 처리 중 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
