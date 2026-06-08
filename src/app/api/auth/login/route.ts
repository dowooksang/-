// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
/**
 * 로그인 API – Supabase 인증 사용
 * 클라이언트에서 POST /api/auth/login 으로 email, password 를 전송하면
 * 성공 시 쿠키(supabase session)와 함께 사용자의 email 을 읽을 수 있는
 * non‑httpOnly 쿠키를 반환합니다.
 */
export async function POST(request: Request) {
  try {
    // 요청의 본문(JSON)이 올바르지 않게 들어왔을 때의 예외 처리를 위해 try-catch 내에서 처리합니다.
    const { email, password } = await request.json();
    // 사용자가 입력한 이메일과 비밀번호로 Supabase Auth 서버에 직접 로그인 인증을 요청합니다.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // 인증에 실패했거나 사용자 데이터가 누락된 경우, 잘못된 자격 증명이므로 401 status 코드로 명확히 응답합니다.
    if (error || !data?.user) {
      console.error('Supabase 로그인 에러:', error?.message, error);
      return NextResponse.json(
        { error: error?.message || '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }
    const user = data.user;
    // 프론트엔드에 필요한 최소한의 관리자 정보(ID, 이메일, 관리 등급 등)만 추려서 JSON으로 전달합니다.
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        level: user.user_metadata?.level ?? 5, // 기본값 LV5_ADMIN (메타데이터가 없어도 안전하도록 fallback 값을 줍니다.)
        ...(user.user_metadata || {}),
      },
      { status: 200 }
    );
    // 세션 정보가 존재한다면 보안 강화를 위해 세션 토큰들을 httpOnly 쿠키로 설정합니다.
    // 이는 XSS(크로스 사이트 스크립팅) 공격으로부터 액세스 토큰이 유출되는 것을 원천적으로 방지하기 위함입니다.
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1주일간 로그인 세션 유지
      });
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30일간 토큰 갱신 가능하도록 유지
      });
    }
    // 클라이언트 사이드 UI(예: 헤더, 대시보드)에서 사용자의 로그인 이메일을 JS 스크립트로 접근하여
    // 화면에 보여줄 수 있도록, 이 쿠키에 한해서만 httpOnly 설정을 false로 지정하여 내보냅니다.
    response.cookies.set('email', user.email, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (e) {
    // 예상치 못한 서버 내 런타임 에러 발생 시 로그를 남기고 500 에러를 내려주어 비정상 종료를 예방합니다.
    console.error('Login route error:', e);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}