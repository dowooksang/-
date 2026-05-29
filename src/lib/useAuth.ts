'use client';
import { useState, useEffect } from 'react';
import { UserLevel } from '@/lib/store';

// 권한 라벨 변환 헬퍼 (6단계 버전)
export const getLevelName = (level: UserLevel) => {
  switch (level) {
    case UserLevel.LV1_GUEST: return '준회원';
    case UserLevel.LV2_MEMBER: return '정회원';
    case UserLevel.LV3_EXCELLENT: return '우수회원';
    case UserLevel.LV4_MANAGER: return '지부장급';
    case UserLevel.LV5_ADMIN: return '관리자';
    case UserLevel.LV6_CEO: return '관리자';
    default: return '알려지지 않음';
  }
};

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 1. 로컬 세션 확인 및 실시간 동기화
    const syncSession = async () => {
      try {
        const savedEmail = localStorage.getItem('jb_session_email');
        if (savedEmail) {
          // 최신 회원 정보 동기화를 위해 서버 API 호출
          const res = await fetch(`/api/auth/me?email=${encodeURIComponent(savedEmail)}`);
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem('jb_session_email', userData.email);
          } else {
            // 서버에 존재하지 않는 이메일인 경우 (예: 서버 재기동으로 메모리 초기화)
            localStorage.removeItem('jb_session_email');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('세션 동기화 실패:', err);
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };

    syncSession();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('jb_session_email', userData.email);
  };

  const logout = async () => {
    localStorage.removeItem('jb_session_email');
    setUser(null);
  };

  return { user, isLoaded, login, logout };
}

