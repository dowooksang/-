// scratch/verify_user.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Node.js 환경에서 WebSocket 에러 방지를 위해 mock 정의
globalThis.WebSocket = class {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ 에러: .env.local 파일에 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const email = 'workersong@gmail.com';

async function verifyAndResetUser() {
  console.log(`[시작] ${email} 유저의 Supabase Auth 상태 강제 변경을 시도합니다...`);
  
  // 1. public.users 에서 ID 조회
  const { data: dbUser, error: dbErr } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (dbErr || !dbUser) {
    console.error('❌ 에러: public.users 테이블에서 유저를 찾을 수 없습니다.', dbErr?.message);
    return;
  }

  console.log(`- 찾은 유저 ID: ${dbUser.id}`);

  // 2. Supabase Auth(auth.users) 정보 업데이트 (이메일 강제 인증 및 임시 비밀번호 설정)
  const { data: authUser, error: authErr } = await supabase.auth.admin.updateUserById(
    dbUser.id,
    {
      password: 'workersong123!',
      email_confirm: true
    }
  );

  if (authErr) {
    console.error('❌ 에러: Supabase Auth 업데이트 실패:', authErr.message);
  } else {
    console.log('======================================================');
    console.log('✅ 성공: 이메일 인증 강제 처리 및 임시 비밀번호 설정 완료.');
    console.log(`- 임시 비밀번호: workersong123!`);
    console.log('======================================================');
  }
}

verifyAndResetUser();
