import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * 서버 컴포넌트 또는 API 라우트 환경에서 매 요청마다 독립적으로 Supabase 클라이언트를 생성합니다.
 * 브라우저 쿠키에 저장된 sb-access-token과 sb-refresh-token 세션을 복구하여 RLS 보안 정책을 정상 통과시킵니다.
 */
export async function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Anon Key is missing in environment variables.');
  }

  // 매 요청마다 격리된 클라이언트 생성 (서버 사이드 세션 혼선 및 메모리 릭 방지)
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (accessToken && refreshToken) {
      await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  } catch (err) {
    console.warn('Server components cannot access cookies in static generation paths:', err);
  }

  return client;
}
