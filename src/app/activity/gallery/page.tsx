'use client';

import React from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';

export default function GalleryPage() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) return <div className="py-20 text-center text-white">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-gradient-to-r from-[#0A103D] via-[#1A2255] to-[#0A103D] py-16 text-center border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">활동갤러리</h1>
        <p className="text-lg text-gray-300">연합회와 각 지부의 다채로운 행사 사진들을 공유합니다.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">최신 사진</h2>
          
          {user && user.level !== undefined && user.level >= UserLevel.LV2_MEMBER ? (
            <button className="bg-accent text-[#0A103D] font-bold px-6 py-2.5 rounded-lg hover:bg-[#82C8FF] transition-all shadow-md">
              사진 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert('사진 업로드는 정회원 이상부터 가능합니다.\n가입 승인을 기다려주세요.')}
              className="bg-white/10 text-gray-400 font-medium px-6 py-2.5 rounded-lg border border-white/10 cursor-not-allowed"
            >
              사진 올리기 (정회원 전용)
            </button>
          )}
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-500">
          <p>등록된 사진이 없습니다. 첫 번째 사진을 올려보세요!</p>
        </div>
      </div>
    </div>
  );
}
