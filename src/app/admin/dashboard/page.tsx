import React from 'react';

/**
 * 최고관리자 전용 대시보드 – Tailwind CSS 기반 디자인
 * 화면 중앙에 환영 인사와 왼쪽에 가짜 사이드바 메뉴를 배치합니다.
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (가짜 메뉴) */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">관리자 메뉴</h2>
        <ul className="space-y-2">
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer">회원 관리</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer">게시판 관리</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer">유통/재고 현황</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Culture Club 24 최고관리자님, 환영합니다! 오늘 하루도 화이팅입니다!
        </h1>
      </main>
    </div>
  );
}

