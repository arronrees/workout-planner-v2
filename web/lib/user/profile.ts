'use server';

import { createClient } from '@/utils/supabase/server';

export async function createUserProfile(userId: string, name: string) {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('user_profile').insert({
      user_id: userId,
      display_name: name,
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
