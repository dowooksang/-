// src/lib/useAuth.ts
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  email: string;
  level?: number;
  nickname?: string;
  createdAt?: string;
  position?: string;
};

type AuthContextType = {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  login: async () => {},
  logout: async () => {},
});

/** Helper to read a cookie value on the client */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/** AuthProvider – manages Supabase auth state and restores session from cookies */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ① Initialise: try to recover Supabase session using official getSession()
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            level: session.user.user_metadata?.level,
            nickname: session.user.user_metadata?.nickname || session.user.user_metadata?.name || '',
            createdAt: session.user.created_at,
            position: session.user.user_metadata?.position,
          });
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error('Session recovery error:', err);
      }
      
      const emailFromCookie = getCookie('email');
      if (emailFromCookie) {
        setUser({ id: '', email: emailFromCookie } as User);
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  // ② Listen for Supabase auth changes (sign‑in, sign‑out, token refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          level: session.user.user_metadata?.level,
          nickname: session.user.user_metadata?.nickname || session.user.user_metadata?.name || '',
          createdAt: session.user.created_at,
          position: session.user.user_metadata?.position,
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ③ Login: 사용자의 요청대로 supabase.auth.signInWithPassword 공식 Auth API를 직접 사용합니다.
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    if (data?.user) {
      const loggedUser = {
        id: data.user.id,
        email: data.user.email ?? '',
        level: data.user.user_metadata?.level,
        nickname: data.user.user_metadata?.nickname || data.user.user_metadata?.name || '',
        createdAt: data.user.created_at,
        position: data.user.user_metadata?.position,
      };
      setUser(loggedUser);
      localStorage.setItem('jb_session_email', loggedUser.email);
      // 백엔드 세션 호환을 위한 plain email 쿠키 설정
      document.cookie = `email=${encodeURIComponent(loggedUser.email)}; path=/; max-age=604800; sameSite=lax`;
    }
    
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('jb_session_email');
    // Remove the plain email cookie we set on login
    document.cookie = 'email=; Max-Age=0; path=/; domain=' + location.hostname;
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/** Helper to display a friendly level name in the UI */
export const getLevelName = (level?: number) => {
  switch (level) {
    case 6:
      return '관리자';
    case 5:
      return '슈퍼관리자';
    case 4:
      return '운영자';
    default:
      return '회원';
  }
};