'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import SettingsForm from '@/components/SettingsForm';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { useRouter } from 'next/navigation';

/**
 * 최고관리자 전용 대시보드 – Tailwind CSS 기반 디자인
 * 실제 작동하는 관리자 메뉴 링크들이 포함된 사이드바와 대시보드 메인을 렌더링합니다.
 */
export default function AdminDashboard() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  // 최고관리자/관리자 권한(level 5 이상) 검증 및 홈으로 리다이렉트
  useEffect(() => {
    if (isLoaded) {
      if (!user || user.level === undefined || user.level < UserLevel.LV5_ADMIN) {
        router.push('/');
      }
    }
  }, [isLoaded, user, router]);

  // 로딩 중이거나 권한이 없는 경우 화면 정보 노출 방지
  if (!isLoaded || !user || user.level === undefined || user.level < UserLevel.LV5_ADMIN) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-center mt-12">
          {/* Welcome Message Card */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center min-h-[340px]">
            <span className="text-6xl mb-4">👑</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 leading-normal">
              Culture Club 24<br />최고관리자님, 환영합니다!
            </h1>
            <p className="text-gray-500 mt-4 text-sm font-medium">오늘 하루도 연합회를 위해 힘내주세요! 화이팅입니다!</p>
          </div>
          
          {/* Settings Form Card */}
          <div className="flex-1 w-full">
            <SettingsForm />
          </div>
        </div>
      </main>
    </div>
  );
}
