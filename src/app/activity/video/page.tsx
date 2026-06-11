'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// YouTube 썸네일 추출 유틸리티 (ID 추출 후 고화질 썸네일 사용)
function getYouTubeThumbnail(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

export default function VideoPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', 'video')
          .single();
        if (!error && data) {
          setWriteLevel(data.write_level);
        } else {
          setWriteLevel(2); // fallback
        }
      } catch (err) {
        setWriteLevel(2);
      }
    };
    fetchWriteLevel();
  }, []);

  const mockVideos = [
    {
      id: 1,
      title: '2026 연합회 마스터스 무대 시범 영상',
      author: '관리자',
      date: '2026.05.12',
      url: 'https://youtu.be/nlVHkhhiTXM?si=YsTXuCrCtsngyvec',
      views: 104,
    }
  ];

  if (!isLoaded || writeLevel === null) return <div className="py-20 text-center text-white">로딩 중...</div>;

  const levelNames: Record<number, string> = {
    1: '준회원 (LV1)',
    2: '정회원 (LV2)',
    3: '우수회원 (LV3)',
    4: '지부장급 (LV4)',
    5: '관리자 (LV5)',
    6: '최고관리자 (LV6)'
  };
  const targetLevelName = levelNames[writeLevel] || '정회원 (LV2)';

  return (
    <div className="min-h-screen bg-primary">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A103D] via-[#1A2255] to-[#0A103D] py-16 text-center border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">공연영상</h1>
        <p className="text-lg text-gray-300">
          연합회 회원분들의 뜨거운 공연 현장을 영상으로 만나보세요.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">최신 영상</h2>
          
          {/* 정회원 이상만 글쓰기 버튼 표시 */}
          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button className="bg-accent text-[#0A103D] font-bold px-6 py-2.5 rounded-lg hover:bg-[#82C8FF] transition-all shadow-md flex items-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              영상 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert(`영상 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인을 기다려주세요.`)}
              className="bg-white/10 text-gray-400 font-medium px-6 py-2.5 rounded-lg border border-white/10 cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              영상 올리기 ({targetLevelName} 전용)
            </button>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockVideos.map((video) => (
            <div key={video.id} className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden group hover:border-accent/50 transition-all shadow-lg hover:shadow-accent/10">
              <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={getYouTubeThumbnail(video.url) || ''} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/90 text-[#0A103D] flex items-center justify-center shadow-2xl scale-90 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </a>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                      {video.author.charAt(0)}
                    </div>
                    {video.author}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>{video.date}</span>
                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {video.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
