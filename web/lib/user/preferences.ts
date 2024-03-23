'use server';

import { createClient } from '@/utils/supabase/server';

export async function createUserPreferences(userId: string) {
  const supabase = createClient();

  const { error } = await supabase.from('user_preferences').insert({
    user_id: userId,
    weight_unit: 'kg',
  });

  return {
    success: !error,
    error,
  };
}
