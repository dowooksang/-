'use client';
import { useState, useEffect } from 'react';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabase';

// 권한 라벨 변환 헬퍼 (6단계 버전)
export const getLevelName = (level: UserLevel) => {
  switch (level) {
    case UserLevel.LV1_GUEST: return '준회원';
    case UserLevel.LV2_MEMBER: return '정회원';
    case UserLevel.LV3_EXCELLENT: return '우수회원';
    case UserLevel.LV4_MANAGER: return '지부장급';
    case UserLevel.LV5_ADMIN: return '관리자';
    case UserLevel.LV6_CEO: return '대표이사';
    default: return '알려지지 않음';
  }
};

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 1. 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email,
          level: meta.level || UserLevel.LV1_GUEST,
          name: meta.name || '이름없음',
          nickname: meta.name || '이름없음',
          bandName: meta.bandName || '소속 없음',
          status: 'active'
        });
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    // 2. 로그인/로그아웃 상태 변화 실시간 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email,
          level: meta.level || UserLevel.LV1_GUEST,
          name: meta.name || '이름없음',
          nickname: meta.name || '이름없음',
          bandName: meta.bandName || '소속 없음',
          status: 'active'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = () => {}; // Supabase Auth는 이제 직접 로그인 함수를 호출합니다.
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, isLoaded, login, logout };
}
