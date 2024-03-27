import { z } from 'zod';

export const signupUserModel = z
  .object({
    firstName: z
      .string({
        required_error: 'First Name is required',
        invalid_type_error: 'First Name must be a string',
      })
      .min(1, 'First Name is required'),
    lastName: z
      .string({
        required_error: 'Last Name is required',
        invalid_type_error: 'Last Name must be a string',
      })
      .min(1, 'Last Name is required'),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email(),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(6, 'Password must be at least 6 characters'),
  })
  .strict();

export type SignupUserType = z.infer<typeof signupUserModel>;

export const signinUserModel = z
  .object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email(),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  })
  .strict();

export type SigninUserType = z.infer<typeof signinUserModel>;

export const updateUserModel = z
  .object({
    firstName: z
      .string({
        required_error: 'First Name is required',
        invalid_type_error: 'First Name must be a string',
      })
      .min(1, 'First Name is required'),
    lastName: z
      .string({
        required_error: 'Last Name is required',
        invalid_type_error: 'Last Name must be a string',
      })
      .min(1, 'Last Name is required'),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email(),
  })
  .strict();

export type UpdateUserType = z.infer<typeof updateUserModel>;

export const updateProfileModel = z
  .object({
    displayName: z
      .string({
        required_error: 'Display Name is required',
        invalid_type_error: 'Display Name must be a string',
      })
      .min(1, 'Display Name is required'),
  })
  .strict();

export type UpdateProfileType = z.infer<typeof updateProfileModel>;
