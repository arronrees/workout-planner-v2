'use server';

import { createClient } from '@/utils/supabase/server';

export async function createUserPreferences(userId: string) {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('user_preferences').insert({
      user_id: userId,
      weight_unit: 'kg',
    });

    return {
      success: !error,
      error,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: 'Something went wrong creating the user profile.',
    };
  }
}
