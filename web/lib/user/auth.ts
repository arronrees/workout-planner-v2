'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import {
  checkUserSigninObjectValid,
  checkUserSignupObjectValid,
  checkUserUpdateObjectValid,
} from '@/lib/validation';
import { createUserProfile } from './profile';
import { createUserPreferences } from './preferences';

export async function login(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error: validationError } = await checkUserSigninObjectValid(data);

  if (validationError) {
    console.error('Signin Validation Error: ', validationError);

    return { errorMessage: validationError, success: false };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Signin Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}

export async function signup(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const data = {
    lastName: formData.get('lastName') as string,
    firstName: formData.get('firstName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error: validationError } = await checkUserSignupObjectValid(data);

  if (validationError) {
    console.error('Signup Validation Error: ', validationError);

    return { errorMessage: validationError, success: false };
  }

  const { error, data: signupData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (error) {
    console.error('Signup Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  if (signupData && signupData.user) {
    await createUserProfile(
      signupData.user.id,
      signupData.user.user_metadata?.first_name
    );

    await createUserPreferences(signupData.user.id);
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}

export async function forgotPassword(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    console.error('Forgot Password Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}

export async function resetPassword(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (password !== passwordConfirmation) {
    return { errorMessage: 'Passwords do not match', success: false };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('Reset Password Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}

export async function updateUser(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
  };

  const { error: validationError } = await checkUserUpdateObjectValid(data);

  if (validationError) {
    console.error('Update User Validation Error: ', validationError);

    return { errorMessage: validationError, success: false };
  }

  const { error } = await supabase.auth.updateUser({
    email: data.email,
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
    },
  });

  if (error) {
    console.error('Update User Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}

export async function updateUserPassword(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const supabase = createClient();

  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (password !== passwordConfirmation) {
    return { errorMessage: 'Passwords do not match', success: false };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('Reset Password Auth Error: ', error);

    return { errorMessage: error.message, success: false };
  }

  revalidatePath('/', 'layout');
  return { errorMessage: null, success: true };
}
