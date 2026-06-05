// src/lib/useAuth.ts
// src/lib/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserLevel } from '@/lib/store';

// ---------------------------------------------------------------------
// Helper: convert a UserLevel enum value to a human‑readable label
export const getLevelName = (level: UserLevel) => {
  switch (level) {
    case UserLevel.LV1_GUEST:
      return '준회원';
    case UserLevel.LV2_MEMBER:
      return '정회원';
    case UserLevel.LV3_EXCELLENT:
      return '우수회원';
    case UserLevel.LV4_MANAGER:
      return '지부장급';
    case UserLevel.LV5_ADMIN:
      return '관리자';
    case UserLevel.LV6_CEO:
      return 'CEO';
    default:
      return '알려지지 않음';
  }
};
// ---------------------------------------------------------------------
// Hook that exposes authentication state to the entire app
export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // -----------------------------------------------------------------
    // ① Server‑side: when the page is rendered on the server (SSR) the
    //    Supabase client already knows the session from the cookies.
    //    We read it once so the UI is hydrated with the logged‑in user.
    const init = async () => {
      const {
        data: { user: serverUser },
      } = await supabase.auth.getUser();

      if (serverUser) {
        setUser(serverUser);
        localStorage.setItem('jb_session_email', serverUser.email);
      }

      // -----------------------------------------------------------------
      // ② Client‑side: keep local storage in sync (for page refreshes)
      const savedEmail = localStorage.getItem('jb_session_email');
      if (savedEmail) {
        // NOTE: 기존에 `/api/auth/me` 라는 엔드포인트가 없어서 오류가 발생했습니다.
        //       이제는 별도 API 호출 없이 로컬에 저장된 이메일을 그대로 사용합니다.
        //       필요 시 아래 코드를 활성화해 자체 `/api/auth/me` 를 구현할 수 있습니다.
        // try {
        //   const res = await fetch(`/api/auth/me?email=${encodeURIComponent(savedEmail)}`);
        //   if (res.ok) {
        //     const userData = await res.json();
        //     setUser(userData);
        //   }
        // } catch (e) {
        //   console.error('세션 동기화 실패:', e);
        // }
      }

      // -----------------------------------------------------------------
      // ③ Listen to Supabase auth events (sign‑in / sign‑out) for real‑time UI updates
      const { data: listener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            localStorage.setItem('jb_session_email', session.user.email);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('jb_session_email');
          }
        }
      );

      // Cleanup on unmount
      return () => {
        listener?.unsubscribe();
      };
    };

    // Kick off the async init routine and mark the hook as loaded afterwards
    init().then(() => setIsLoaded(true));
  }, []);

  // -----------------------------------------------------------------
  // Manually called after a successful login API call
  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('jb_session_email', userData.email);
  };

  // -----------------------------------------------------------------
  // Logout – removes Supabase session, deletes the email cookie and clears local storage
  const logout = async () => {
    await supabase.auth.signOut();
    // Delete the (non‑httpOnly) email cookie we set in the login API
    document.cookie = 'email=; Max-Age=0; path=/;';
    localStorage.removeItem('jb_session_email');
    setUser(null);
  };

  return { user, isLoaded, login, logout };
}
