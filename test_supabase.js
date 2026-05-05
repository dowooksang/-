const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.from('posts').select('id').limit(1);
    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      console.log('Success! Supabase connection is working. Posts fetched:', data);
    }
  } catch (err) {
    console.error('Caught error:', err);
  }
}

testConnection();
