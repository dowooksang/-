'use client';
// src/lib/useAuth.ts
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  email: string;
  level?: number;
  nickname?: string;
  name?: string;
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

  // DB에서 유저 정보를 조회하되, 없으면 자동으로 복구/생성(Self-healing)해주는 헬퍼
  const fetchOrCreateDbUser = async (userId: string, email: string, metadata: any) => {
    if (!userId) return null;
    try {
      // 1순위: id (userId)로 조회하여 RLS 보안 정책 통과 확률과 정확도를 극대화합니다.
      let { data: dbData, error: dbErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // 2순위: id로 찾지 못했으나 이메일 정보가 있다면 이메일로도 보완 조회합니다.
      if ((dbErr || !dbData) && email) {
        const { data: emailData, error: emailErr } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        if (!emailErr && emailData) {
          dbData = emailData;
          dbErr = null;
        }
      }

      if (!dbErr && dbData) {
        return dbData;
      }

      // 데이터가 존재하지 않거나 스키마 캐시 문제 등으로 조회가 실패한 경우 자체 복구
      if (dbErr && (dbErr.code === 'PGRST116' || dbErr.message.includes('schema cache') || dbErr.message.includes('public.users'))) {
        const defaultNickname = metadata?.nickname || metadata?.name || email.split('@')[0];
        const defaultName = metadata?.name || email.split('@')[0];
        
        const { data: insertData, error: insertErr } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            nickname: defaultNickname,
            name: defaultName,
            phone: metadata?.phone || null,
            band_name: metadata?.band_name || '소속 없음',
            position: metadata?.position || null,
            address: metadata?.address || null,
            status: 'pending',
            level: 1
          })
          .select()
          .single();
        
        if (!insertErr && insertData) {
          return insertData;
        } else {
          console.error('Self-healing: user creation failed in DB:', insertErr);
        }
      }
    } catch (e) {
      console.error('Self-healing unexpected error:', e);
    }
    return null;
  };

  // ① Initialise: try to recover Supabase session using official getSession()
  useEffect(() => {
    const init = async () => {
      try {
        // API Route에서 로그인 시 설정한 httpOnly 쿠키 토큰들을 읽어와 클라이언트 Supabase SDK에 주입합니다.
        const accessToken = getCookie('sb-access-token');
        const refreshToken = getCookie('sb-refresh-token');
        
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          const email = session.user.email ?? '';
          const dbUser = await fetchOrCreateDbUser(session.user.id, email, session.user.user_metadata);

          setUser({
            id: session.user.id,
            email: email,
            level: dbUser ? dbUser.level : 1,
            nickname: dbUser ? dbUser.nickname : (session.user.user_metadata?.nickname || session.user.user_metadata?.name || email.split('@')[0]),
            name: dbUser ? dbUser.name : (session.user.user_metadata?.name || session.user.user_metadata?.full_name),
            createdAt: dbUser ? dbUser.created_at : session.user.created_at,
            position: dbUser ? dbUser.position : session.user.user_metadata?.position,
          });
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error('Session recovery error:', err);
      }
      
      // 쿠키 기반 이메일이 존재할 시 DB에서 온전한 회원 정보를 복구하여 Level과 닉네임이 정상 적용되도록 합니다.
      const emailFromCookie = getCookie('email');
      if (emailFromCookie) {
        try {
          const { data: dbUser, error: dbErr } = await supabase
            .from('users')
            .select('*')
            .eq('email', emailFromCookie)
            .single();

          if (!dbErr && dbUser) {
            setUser({
              id: dbUser.id,
              email: emailFromCookie,
              level: dbUser.level,
              nickname: dbUser.nickname,
              name: dbUser.name,
              createdAt: dbUser.created_at,
              position: dbUser.position,
            });
            setIsLoaded(true);
            return;
          }
        } catch (e) {
          console.error('Cookie-based session recovery failed:', e);
        }
      }
      
      setUser(null);
      setIsLoaded(true);
    };
    init();
  }, []);

  // ② Listen for Supabase auth changes (sign‑in, sign‑out, token refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const email = session.user.email ?? '';
        const dbUser = await fetchOrCreateDbUser(session.user.id, email, session.user.user_metadata);

        setUser({
          id: session.user.id,
          email: email,
          level: dbUser ? dbUser.level : 1,
          nickname: dbUser ? dbUser.nickname : (session.user.user_metadata?.nickname || session.user.user_metadata?.name || email.split('@')[0]),
          name: dbUser ? dbUser.name : (session.user.user_metadata?.name || session.user.user_metadata?.full_name),
          createdAt: dbUser ? dbUser.created_at : session.user.created_at,
          position: dbUser ? dbUser.position : session.user.user_metadata?.position,
        });

        // 클라이언트 세션 변경 시 쿠키 실시간 동기화
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; sameSite=lax`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=2592000; sameSite=lax`;
        document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=604800; sameSite=lax`;
      } else {
        setUser(null);
        // 세션 해제 시 쿠키 파기
        document.cookie = `email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/`;
        document.cookie = `sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/`;
        document.cookie = `sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/`;
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
      const userEmail = data.user.email ?? '';
      const dbUser = await fetchOrCreateDbUser(data.user.id, userEmail, data.user.user_metadata);

      const loggedUser = {
        id: data.user.id,
        email: userEmail,
        level: dbUser ? dbUser.level : 1,
        nickname: dbUser ? dbUser.nickname : (data.user.user_metadata?.nickname || data.user.user_metadata?.name || userEmail.split('@')[0]),
        name: dbUser ? dbUser.name : (data.user.user_metadata?.name || data.user.user_metadata?.full_name),
        createdAt: dbUser ? dbUser.created_at : data.user.created_at,
        position: dbUser ? dbUser.position : data.user.user_metadata?.position,
      };
      setUser(loggedUser);
      localStorage.setItem('jb_session_email', loggedUser.email);
      
      // 세션 토큰 즉시 동기화 (onAuthStateChange의 비동기 딜레이 방지)
      if (data.session) {
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; sameSite=lax`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=2592000; sameSite=lax`;
      }
      
      // 백엔드 세션 호환을 위한 plain email 쿠키 설정
      document.cookie = `email=${encodeURIComponent(loggedUser.email)}; path=/; max-age=604800; sameSite=lax`;
    }
    
    return data;
  };

  const logout = async () => {
    try {
      // 1. 백엔드 API를 호출하여 httpOnly 세션 쿠키들을 서버 사이드에서 강제 파기 (리다이렉트 취소 방지)
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('로그아웃 API 호출 실패:', e);
    }

    try {
      // 2. Supabase 공식 signOut 호출하여 SDK 내부 상태 파기
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut 에러:', e);
    }

    // 3. 로컬 상태 및 로컬 스토리지 데이터 정리
    setUser(null);
    localStorage.removeItem('jb_session_email');

    // 4. 클라이언트 단에서도 만약을 대비해 쿠키 정리 시도 (다양한 도메인 스코프 고려)
    try {
      const domains = [location.hostname, '', `.${location.hostname.split('.').slice(-2).join('.')}`];
      domains.forEach(domain => {
        const domainStr = domain ? `; domain=${domain}` : '';
        document.cookie = `email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/${domainStr}`;
        document.cookie = `sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/${domainStr}`;
        document.cookie = `sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; path=/${domainStr}`;
      });
    } catch (cookieErr) {
      console.error('클라이언트 쿠키 수동 삭제 실패:', cookieErr);
    }
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
      return '최고관리자';
    case 5:
      return '슈퍼관리자';
    case 4:
      return '운영자';
    case 3:
      return '우수회원';
    case 2:
      return '정회원';
    case 1:
      return '준회원';
    default:
      return '회원';
  }
};