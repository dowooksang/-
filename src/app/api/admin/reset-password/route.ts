// src/app/api/admin/reset-password/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role key must be defined in .env.local as SUPABASE_SERVICE_ROLE_KEY
const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceKey);
};

export async function POST(request: Request) {
  const supabase = getAdminSupabase();
  try {
    const { email, newPassword } = await request.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'email and newPassword are required' }, { status: 400 });
    }

    // Find user by email
    const { data: user, error: findErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (findErr || !user) {
      return NextResponse.json({ error: findErr?.message || '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // Update password
    const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
