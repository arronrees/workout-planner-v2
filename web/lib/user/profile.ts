'use server';

import { createClient } from '@/utils/supabase/server';

export async function createUserProfile(userId: string, name: string) {
  const supabase = createClient();

  const { error } = await supabase.from('user_profile').insert({
    user_id: userId,
    display_name: name,
  });

  return {
    success: !error,
    error,
  };
}
