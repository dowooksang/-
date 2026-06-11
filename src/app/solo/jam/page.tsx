'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';

export default function JamPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', 'jam')
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
      <div className="bg-gradient-to-r from-[#0A103D] via-[#1A2255] to-[#0A103D] py-16 text-center border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">방구석 릴레이 잼</h1>
        <p className="text-lg text-gray-300">집에서 연주한 영상을 올리고 다른 회원들과 온라인으로 잼(Jam)을 즐겨보세요.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">최신 잼 트랙</h2>
          
          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button className="bg-accent text-[#0A103D] font-bold px-6 py-2.5 rounded-lg hover:bg-[#82C8FF] transition-all shadow-md cursor-pointer">
              트랙 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert(`트랙 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인을 기다려주세요.`)}
              className="bg-white/10 text-gray-400 font-medium px-6 py-2.5 rounded-lg border border-white/10 cursor-not-allowed"
            >
              트랙 올리기 ({targetLevelName} 전용)
            </button>
          )}
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-500">
          <p>등록된 트랙이 없습니다. 첫 번째 잼 트랙을 올려보세요!</p>
        </div>
      </div>
    </div>
  );
}
