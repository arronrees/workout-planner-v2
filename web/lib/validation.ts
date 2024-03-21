import { signinUserModel, signupUserModel } from '@/models/user';
import { z } from 'zod';

export async function checkUserSignupObjectValid(user: any): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    signupUserModel.parse(user);

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export async function checkUserSigninObjectValid(user: any): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    signinUserModel.parse(user);

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}
