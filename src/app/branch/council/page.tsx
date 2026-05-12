'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import Link from 'next/link';

export default function BranchCouncilPage() {
  const { user, isLoaded } = useAuth();
  
  if (!isLoaded) return <div className="min-h-screen bg-[#0A103D] text-white flex items-center justify-center">로딩 중...</div>;

  // 권한 체크: 밴드마스터(지부장) 이상만 접근 가능
  if (!user || user.level < UserLevel.MASTER) {
    return (
      <div className="min-h-screen bg-[#0A103D] flex items-center justify-center p-6 text-center">
        <div className="bg-white/5 p-12 rounded-2xl border border-white/10 max-w-lg w-full backdrop-blur-md">
          <div className="text-6xl mb-6">⛔</div>
          <h1 className="text-2xl font-bold text-white mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            해당 게시판은 연합회 공식 <b>승인을 받은 지부장 및 운영진 전용</b> 비밀 게시판입니다.<br/>
            일반 회원 및 대기 중인 신청자는 열람하실 수 없습니다.
          </p>
          <Link href="/" className="bg-accent text-[#0A103D] px-8 py-3 rounded-lg font-bold hover:bg-[#82C8FF] transition-colors">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 헤더 섹션 */}
      <div className="bg-[#0A103D] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">비밀게시판</span>
              <span className="bg-white/20 text-accent text-xs font-bold px-2 py-1 rounded">지부장 전용</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">지부장 회의실</h1>
            <p className="text-gray-400">전국 지부장님들과 연합회 운영진이 직접 소통하고 주요 안건을 논의하는 공간입니다.</p>
          </div>
          <div className="hidden md:block text-6xl">🤝</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 임시 UI (실제 게시판 기능은 기존 Board 연동 가능) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="text-4xl mb-4">🛠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">지부장 전용 비밀 게시판 준비 중</h2>
          <p className="text-gray-500 mb-6">현재 권한 설정 테스트가 완료되었습니다. 실제 게시판 연동을 준비하고 있습니다.</p>
          <p className="text-sm text-accent bg-accent/10 py-2 px-4 rounded-lg inline-block font-medium">
            환영합니다, {user.nickname}님! 현재 <b>지부장(마스터)</b> 등급으로 인증되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
