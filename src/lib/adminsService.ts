import { supabase } from './supabaseClient';

/**
 * 최고관리자 계정을 시드합니다.
 * 이메일은 `dowooksang@gmail.com`이며 레벨 6(최고관리자)으로 고정됩니다.
 */
export async function seedSuperAdmin(email: string = 'dowooksang@gmail.com') {
  const { data, error } = await supabase
    .from('admin_users')
    .upsert({
      email,
      level: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .single();

  if (error && error.code !== '23505') { // 중복 오류는 무시
    throw error;
  }
  return data;
}
