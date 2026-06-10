// check_user.mjs
import { createClient } from '@supabase/supabase-js';

// Node.js 환경에서 WebSocket 에러 방지를 위해 mock 정의
globalThis.WebSocket = class {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'dowooksang@gmail.com';

const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();

if (error) {
  console.error('Supabase query error:', error);
  process.exit(1);
}

if (data) {
  console.log('✅ User exists:');
  console.log(JSON.stringify(data, null, 2));
} else {
  console.log('❌ User not found');
}

