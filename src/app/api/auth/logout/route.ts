// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

/**
 * 로그아웃 API – Supabase 세션 쿠키 강제 파기
 * 클라이언트에서 POST /api/auth/logout 요청 시
 * 브라우저에 httpOnly 등으로 저장되어 있는 sb-access-token, sb-refresh-token, email 쿠키를
 * 강제로 만료 처리하여 좀비 세션을 완전히 파기합니다.
 */
export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: '로그아웃 성공 및 세션 쿠키가 정상적으로 파기되었습니다.' },
      { status: 200 }
    );

    // sb-access-token 쿠키 삭제 (만료 처리)
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // 즉시 만료
      expires: new Date(0),
    });

    // sb-refresh-token 쿠키 삭제 (만료 처리)
    response.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // 즉시 만료
      expires: new Date(0),
    });

    // 일반 email 쿠키 삭제 (만료 처리)
    response.cookies.set('email', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // 즉시 만료
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('로그아웃 API 처리 중 오류 발생:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
