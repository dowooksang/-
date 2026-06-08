import { supabase } from './src/lib/supabaseClient';

const email = 'dowooksang@gmail.com';

(async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    process.exit(1);
  }

  if (data) {
    console.log('User exists:', JSON.stringify(data, null, 2));
  } else {
    console.log('User not found');
  }
})();
