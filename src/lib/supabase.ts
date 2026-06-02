import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * admins 테이블에서 이메일로 관리자 레코드 조회
 */
export const getAdminByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, level')
    .eq('email', email)
    .single();
  if (error) throw error;
  return data;
};

/**
 * 현재 사용자 객체에 level 필드가 있으면 최고관리자(레벨 6)인지 판단
 */
export const isAdmin = (user: any) => {
  return user?.level && Number(user.level) === 6;
};
