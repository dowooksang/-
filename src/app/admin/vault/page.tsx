import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabaseServer';
import { UserLevel } from '@/lib/store';
import VaultClient from './VaultClient';

export const dynamic = 'force-dynamic';

export default async function AdminVaultPage() {
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get('email')?.value;

  if (!emailCookie) {
    redirect('/');
  }

  // 2차 서버 사이드 권한 검증 (절대 타협 불가)
  let userLevel = 0;
  let currentUser = null;

  try {
    const supabaseServer = await createServerSupabase();
    const { data: dbUser, error } = await supabaseServer
      .from('users')
      .select('id, email, nickname, name, level')
      .eq('email', decodeURIComponent(emailCookie))
      .single();

    if (error || !dbUser) {
      redirect('/');
    }

    userLevel = dbUser.level ?? 1;
    currentUser = dbUser;
  } catch (err) {
    redirect('/');
  }

  if (userLevel !== UserLevel.LV6_CEO) {
    redirect('/');
  }

  return <VaultClient currentUser={currentUser} />;
}
