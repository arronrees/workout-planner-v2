'use server';

import { createClient } from '@/utils/supabase/server';
import { checkProfileUpdateObjectValid } from '../validation';
import { revalidatePath } from 'next/cache';

export async function createUserProfile(userId: string, name: string) {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('user_profiles').insert({
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

export async function updateProfile(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { errorMessage: 'User not found', success: false };
    }

    const data = {
      displayName: formData.get('displayName') as string,
    };

    const { success, error: validationError } =
      await checkProfileUpdateObjectValid(data);

    if (validationError) {
      console.error('Update Profile Validation Error: ', validationError);

      return { errorMessage: validationError, success: false };
    }

    const { error, data: updateProfileData } = await supabase
      .from('user_profiles')
      .update({
        display_name: data.displayName,
      })
      .eq('user_id', user?.id);

    if (error) {
      console.error('Update Profile Error: ', error);

      return { errorMessage: error.message, success: false };
    }

    revalidatePath('/', 'layout');
    return { errorMessage: null, success: true };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      errorMessage: 'Something went wrong updating the user profile.',
    };
  }
}
