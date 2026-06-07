import { NextResponse } from 'next/server';

export function middleware() {
  // 🚨 경호원 전원 해고! 묻지도 따지지도 않고 무조건 통과!
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};