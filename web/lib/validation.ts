import {
  signinUserModel,
  signupUserModel,
  updatePreferencesModel,
  updateProfileModel,
  updateUserModel,
} from '@/models/user';
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

export async function checkUserUpdateObjectValid(user: any): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    updateUserModel.parse(user);

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export async function checkProfileUpdateObjectValid(profile: any): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    updateProfileModel.parse(profile);

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export async function checkPreferencesUpdateObjectValid(
  preferences: any
): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    updatePreferencesModel.parse(preferences);

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0].message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}
