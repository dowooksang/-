import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

globalThis.WebSocket = class {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking users table...');
  const { data: usersData, error: usersError } = await supabase.from('users').select('*');
  if (usersError) {
    console.error('Error fetching users:', usersError);
  } else {
    console.log('Success fetching users. Total users:', usersData.length);
    console.log('Users:', JSON.stringify(usersData, null, 2));
  }

  console.log('Querying triggers...');
  const { data: triggers, error: triggerError } = await supabase.rpc('get_triggers_debug');
  // 만약 get_triggers_debug rpc가 없다면 pg_trigger 쿼리를 sql로 날려야 하는데, rpc가 없을 것이므로 raw query 처리를 직접 할 수 없으니 query를 실행하는 api가 있는지 확인하거나 rpc를 사용해봅니다.
  // 또는 간단히 supabase.from() 대신 postgres system table에 접근이 가능한지 봅니다.
  // pg_trigger는 테이블이 아니므로 .from('pg_trigger')가 불가능할 수 있지만, 일반 db schema인 경우 custom rpc가 정의되어 있을 수 있으니 에러가 날 것입니다.
  // 대신 pg_catalog에 있는 뷰나 테이블을 select할 수 있는지 테스트해보겠습니다.
  const { data: pgData, error: pgError } = await supabase
    .from('users')
    .select('id')
    .limit(1);
  console.log('pg test:', pgData, pgError);


  console.log('Checking site_settings table...');
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) {
    console.error('Error fetching site_settings:', error);
  } else {
    console.log('Success fetching site_settings. Data:', data);
  }
}

check();
