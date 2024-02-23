import { z } from 'zod';

export const signupUserModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
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
    .min(5, 'Password must be at least 5 characters'),
});

export type SignupUserType = z.infer<typeof signupUserModel>;
