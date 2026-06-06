import { NextResponse } from 'next/server';

export function middleware() {
  // 🚨 경호원 전원 해고 및 철수! 무조건 VIP 대시보드로 통과시킵니다.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};