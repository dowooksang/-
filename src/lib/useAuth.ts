'use client';
import { useState, useEffect } from 'react';
import { User, UserLevel } from '@/lib/store';

let currentUser: User | null = null;
const listeners = new Set<(user: User | null) => void>();

export const authActions = {
  login: (user: User) => {
    currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    listeners.forEach(l => l(user));
  },
  logout: () => {
    currentUser = null;
    localStorage.removeItem('auth_user');
    listeners.forEach(l => l(null));
  },
  getUser: () => currentUser
};

// 권한 라벨 변환 헬퍼
export const getLevelName = (level: UserLevel) => {
  switch (level) {
    case UserLevel.GUEST: return '준회원';
    case UserLevel.MEMBER: return '정회원';
    case UserLevel.ACTIVE: return '활동회원';
    case UserLevel.MASTER: return '밴드마스터';
    case UserLevel.ADMIN: return '최고관리자';
    default: return '알려지지 않음';
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    setUser(currentUser);
    setIsLoaded(true);
    
    listeners.add(setUser);
    return () => {
      listeners.delete(setUser);
    };
  }, []);

  return { user, isLoaded, ...authActions };
}
