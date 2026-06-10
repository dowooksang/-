import React from 'react';
import Link from 'next/link';

/**
 * 최고관리자 전용 대시보드 – Tailwind CSS 기반 디자인
 * 실제 작동하는 관리자 메뉴 링크들이 포함된 사이드바와 대시보드 메인을 렌더링합니다.
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (실제 관리자 메뉴 링크 적용) */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">관리자 메뉴</h2>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/admin/members" 
              className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors cursor-pointer font-medium"
            >
              👥 회원 관리
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/posts" 
              className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors cursor-pointer font-medium"
            >
              📝 게시판 관리
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/branches" 
              className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors cursor-pointer font-medium"
            >
              🏢 지부 신청 현황
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/stats" 
              className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors cursor-pointer font-medium"
            >
              📊 사이트 통계
            </Link>
          </li>
          <li className="pt-4 border-t border-gray-200">
            <Link 
              href="/" 
              className="block p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded transition-colors cursor-pointer font-medium"
            >
              🏠 메인 홈으로
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center leading-normal">
          Culture Club 24 최고관리자님, 환영합니다!<br />오늘 하루도 화이팅입니다!
        </h1>
      </main>
    </div>
  );
}
