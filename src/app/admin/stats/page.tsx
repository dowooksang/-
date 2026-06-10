'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

/**
 * 사이트 통계 관리자 페이지
 * Supabase의 users, branches, posts 등 주요 테이블의 총 레코드 수를 가져와 실시간 모니터링 수치로 제공합니다.
 */
export default function StatsPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    guestUsers: 0,
    memberUsers: 0,
    adminUsers: 0,
    totalBranches: 0,
    approvedBranches: 0,
    pendingBranches: 0,
    totalBands: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  // 최고관리자/스태프 권한(level 5 이상) 검증 및 리다이렉트
  useEffect(() => {
    if (isLoaded && (!user || (user.level !== undefined && user.level < 5))) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 1. Users 통계 카운트 (exact count 조회)
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: guestUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('level', 1);

        const { count: memberUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('level', 2);

        const { count: adminUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('level', 5);

        // 2. Branches 통계 카운트
        const { count: totalBranches } = await supabase
          .from('branches')
          .select('*', { count: 'exact', head: true });

        const { count: approvedBranches } = await supabase
          .from('branches')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { count: pendingBranches } = await supabase
          .from('branches')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // 3. 소속 밴드수 집계 (band_count 합계)
        const { data: bandCountData } = await supabase
          .from('branches')
          .select('band_count')
          .eq('status', 'approved');
        
        const totalBands = bandCountData
          ? bandCountData.reduce((sum, row) => sum + (row.band_count || 0), 0)
          : 0;

        // 4. Posts 통계 카운트
        const { count: totalPosts } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalUsers: totalUsers || 0,
          guestUsers: guestUsers || 0,
          memberUsers: memberUsers || 0,
          adminUsers: adminUsers || 0,
          totalBranches: totalBranches || 0,
          approvedBranches: approvedBranches || 0,
          pendingBranches: pendingBranches || 0,
          totalBands,
          totalPosts: totalPosts || 0,
        });
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.level !== undefined && user.level >= 5) {
      fetchStats();
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">관리자 메뉴</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/admin/members" className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors font-medium">
              👥 회원 관리
            </Link>
          </li>
          <li>
            <Link href="/admin/posts" className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors font-medium">
              📝 게시판 관리
            </Link>
          </li>
          <li>
            <Link href="/admin/branches" className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-600 rounded transition-colors font-medium">
              🏢 지부 신청 현황
            </Link>
          </li>
          <li>
            <Link href="/admin/stats" className="block p-2 text-white bg-indigo-600 rounded transition-colors font-medium">
              📊 사이트 통계
            </Link>
          </li>
          <li className="pt-4 border-t border-gray-200">
            <Link href="/admin/dashboard" className="block p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded transition-colors font-medium">
              ⚙️ 대시보드 홈
            </Link>
          </li>
          <li>
            <Link href="/" className="block p-2 text-gray-600 hover:text-white hover:bg-indigo-500 rounded transition-colors font-medium">
              🏠 메인 홈으로
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 border-b border-gray-200 pb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0A103D]">사이트 통계 현황</h1>
              <p className="text-gray-500 mt-1 text-sm">연합회 데이터베이스 실시간 통계 정보입니다.</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="self-start sm:self-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold border border-indigo-200 flex items-center gap-2"
            >
              🔄 새로고침
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 회원 통계 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-semibold text-sm">👥 총 가입 회원 수</span>
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-600 text-lg">📊</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}명</div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 border-t pt-3 mt-4">
                <div>준회원: <span className="font-bold text-gray-700">{stats.guestUsers}</span></div>
                <div>정회원: <span className="font-bold text-blue-600">{stats.memberUsers}</span></div>
                <div>관리자급: <span className="font-bold text-purple-600">{stats.adminUsers}</span></div>
              </div>
            </div>

            {/* 지부 통계 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-semibold text-sm">🏢 총 등록 지부 수</span>
                  <span className="p-2 rounded-lg bg-green-50 text-green-600 text-lg">🏛️</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-2">{stats.totalBranches.toLocaleString()}개</div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 border-t pt-3 mt-4">
                <div>승인됨: <span className="font-bold text-green-600">{stats.approvedBranches}</span></div>
                <div>대기중: <span className="font-bold text-amber-500">{stats.pendingBranches}</span></div>
              </div>
            </div>

            {/* 활동 통계 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-semibold text-sm">🎸 소속 밴드 및 콘텐츠</span>
                  <span className="p-2 rounded-lg bg-purple-50 text-purple-600 text-lg">🎵</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-2">{stats.totalBands.toLocaleString()}개 팀</div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 border-t pt-3 mt-4">
                <div>게시글 수: <span className="font-bold text-gray-700">{stats.totalPosts}개</span></div>
              </div>
            </div>
          </div>

          {/* 세부 수치 요약 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">데이터베이스 테이블 요약</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">테이블명</th>
                    <th scope="col" className="px-6 py-3">설명</th>
                    <th scope="col" className="px-6 py-3">총 레코드 수</th>
                    <th scope="col" className="px-6 py-3">상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">public.users</td>
                    <td className="px-6 py-4">연합회 가입자 정보 (이름, 닉네임, 등급 등)</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{stats.totalUsers}</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">정상 연동</span></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">public.branches</td>
                    <td className="px-6 py-4">전국 지부 정보 및 소속 밴드수 집계</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{stats.totalBranches}</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">정상 연동</span></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">public.posts</td>
                    <td className="px-6 py-4">커뮤니티 및 소식 게시판 내 등록 글</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{stats.totalPosts}</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">정상 연동</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
