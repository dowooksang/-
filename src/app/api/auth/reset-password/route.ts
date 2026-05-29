import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * 비밀번호 재설정 요청 API
 * 1️⃣ Supabase 의 기본 resetPasswordForEmail 로 시도
 * 2️⃣ SMTP 오류 발생 시 Resend 로 직접 메일 전송 (fallback)
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 });
    }

    // ① Supabase 기본 메일 전송 (SMTP 설정이 정상이면 여기서 끝)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
    });

    if (!error) {
      return NextResponse.json({ message: '비밀번호 재설정 이메일을 발송했습니다.' }, { status: 200 });
    }

    // ② SMTP 오류가 발생했을 경우 Resend 로 직접 메일 전송
    console.error('Supabase SMTP 오류:', error.message);

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm?email=${encodeURIComponent(
      email
    )}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@cultureclub24.com';

    if (!resendApiKey) {
      console.error('Resend API KEY 가 설정되지 않았습니다.');
      return NextResponse.json({ error: '메일 전송 설정이 없습니다.' }, { status: 500 });
    }

    const payload = {
      from: fromEmail,
      to: email,
      subject: '비밀번호 재설정 링크',
      html: `
        <p>안녕하세요.</p>
        <p>아래 버튼을 클릭하면 비밀번호를 재설정할 수 있습니다.</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0066ff;color:#fff;text-decoration:none;border-radius:4px;">비밀번호 재설정</a>
        <p>보안 상 30분 이내에 사용해 주세요.</p>
      `,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Resend 메일 전송 실패:', errBody);
      return NextResponse.json({ error: '메일 전송에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ message: '비밀번호 재설정 이메일을 발송했습니다.' }, { status: 200 });
  } catch (e) {
    console.error('reset-password API 예외:', e);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
