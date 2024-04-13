'use server';

import { createClient } from '@/utils/supabase/server';
import { checkPreferencesUpdateObjectValid } from '../validation';
import { revalidatePath } from 'next/cache';

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

export async function updatePreferences(
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
      weightUnit: formData.get('weightUnit') as string,
    };

    const { error: validationError } = await checkPreferencesUpdateObjectValid(
      data
    );

    if (validationError) {
      console.error('Update Preferences Validation Error: ', validationError);

      return { errorMessage: validationError, success: false };
    }

    const { error } = await supabase
      .from('user_preferences')
      .update({
        weight_unit: data.weightUnit,
      })
      .eq('user_id', user?.id);

    if (error) {
      console.error('Update Preferences Error: ', error);

      return { errorMessage: error.message, success: false };
    }

    revalidatePath('/', 'layout');
    return { errorMessage: null, success: true };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      errorMessage: 'Something went wrong updating the user preferences.',
    };
  }
}
