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

  if (!isLoaded || isValidSession === null) return <div className="py-20 text-center text-gray-500">로딩 중...</div>;

  if (!user || !isValidSession) {
    return (
      <div className="bg-white flex-1 w-full flex items-center justify-center py-32">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-500 mb-6">로그인 후(준회원 이상) 글을 작성할 수 있습니다.</p>
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

  // 준회원(LV1_GUEST) 등급 제한 체크: 가입인사(greeting) 게시판 외에는 글쓰기 불가
  const userLevel = user.level ?? UserLevel.LV1_GUEST;
  if (userLevel < UserLevel.LV2_MEMBER && category !== 'greeting') {
    return (
      <div className="bg-white flex-1 w-full flex items-center justify-center py-32">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">글쓰기 권한이 없습니다</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            현재 회원님은 <strong>준회원</strong> 등급입니다.<br />
            자유게시판 등 다른 게시판에 글을 쓰려면 정회원 승인이 필요합니다. 먼저 가입인사 게시판에 글을 작성해 주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/board/write?category=greeting" className="bg-[#5486B2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#436f94] transition-colors">
              가입인사 쓰러 가기
            </Link>
            <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12">
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

