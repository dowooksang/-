import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * 비밀번호 초기화 이메일 전송 API
 * 사용자가 이메일을 입력하면 Supabase가 비밀번호 재설정 링크를 이메일로 발송합니다.
 *
 * POST /api/auth/reset-password
 * Body: { email: string }
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 });
    }

    // Supabase Auth 의 비밀번호 재설정 메서드 호출
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // 비밀번호 재설정 후 리다이렉트될 프론트엔드 URL (필요 시 수정)
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
    });

    if (error) {
      console.error('비밀번호 재설정 요청 오류:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: '비밀번호 재설정 이메일을 발송했습니다.' }, { status: 200 });
  } catch (e) {
    console.error('서버 오류:', e);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
