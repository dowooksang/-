'use client';

import { useState, useEffect, Suspense } from 'react';
import BoardForm from '@/components/BoardForm';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function WritePageContent() {
  const { user, isLoaded } = useAuth();
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [writeLevel, setWriteLevel] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'free';

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsValidSession(!!session);
      } catch (err) {
        console.error('Session validation error:', err);
        setIsValidSession(false);
      }
    };
    if (isLoaded) {
      verifySession();
    }
  }, [isLoaded]);

  // 카테고리별 쓰기 권한 등급 조회
  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', category)
          .single();
        
        if (!error && data) {
          setWriteLevel(data.write_level);
        } else {
          // Fallback 기본값 설정
          const fallbacks: Record<string, number> = {
            notice: 5, free: 2, greeting: 1, promotion: 2, market: 2, archive: 2, qa: 1, press: 5, event: 5
          };
          setWriteLevel(fallbacks[category] ?? 2);
        }
      } catch (err) {
        const fallbacks: Record<string, number> = {
          notice: 5, free: 2, greeting: 1, promotion: 2, market: 2, archive: 2, qa: 1, press: 5, event: 5
        };
        setWriteLevel(fallbacks[category] ?? 2);
      }
    };

    fetchWriteLevel();
  }, [category]);

  if (!isLoaded || isValidSession === null || writeLevel === null) return <div className="py-20 text-center text-gray-500">로딩 중...</div>;

  if (!user || !isValidSession) {
    return (
      <div className="bg-white flex-1 w-full flex items-center justify-center py-32 text-black">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-500 mb-6">로그인 후 글을 작성할 수 있습니다.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="bg-[#0A103D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a225c] transition-colors">
              로그인하기
            </Link>
            <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 게시판 권한 대조 검증
  const userLevel = user.level ?? UserLevel.LV1_GUEST;
  if (userLevel < writeLevel) {
    const levelNames: Record<number, string> = {
      1: '준회원 (LV1)',
      2: '정회원 (LV2)',
      3: '우수회원 (LV3)',
      4: '지부장급 (LV4)',
      5: '관리자 (LV5)',
      6: '최고관리자 (LV6)'
    };
    const targetLevelName = levelNames[writeLevel] || `LV${writeLevel}`;

    return (
      <div className="bg-white flex-1 w-full flex items-center justify-center py-32 text-black">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">글쓰기 권한이 없습니다</h1>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm">
            해당 게시판에 글을 쓰려면 <strong>{targetLevelName}</strong> 이상의 등급이 필요합니다.<br />
            (현재 등급: {levelNames[userLevel] || `LV${userLevel}`})
          </p>
          <div className="flex gap-4 justify-center">
            {userLevel < 2 && (
              <Link href="/board/write?category=greeting" className="bg-[#5486B2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#436f94] transition-colors">
                가입인사 쓰러 가기
              </Link>
            )}
            <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12 text-black">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#333333]">새 글 작성</h1>
            <p className="text-gray-500 mt-2 text-sm">내용을 정확하게 기입해주세요.</p>
          </div>
        </div>

        <BoardForm category={category} />
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">로딩 중...</div>}>
      <WritePageContent />
    </Suspense>
  );
}

