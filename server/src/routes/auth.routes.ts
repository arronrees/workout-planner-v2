import { Router } from 'express';
import {
  checkUserSignupObjectValid,
  checkUserSigninObjectValid,
} from '../middleware/auth.middleware';
import {
  signinUserController,
  signupUserController,
  verifyEmailController,
} from '../controllers/auth.controller';

export const authRouter = Router();

// user signup
authRouter.post('/signup', checkUserSignupObjectValid, signupUserController);

// user signin
authRouter.post('/signin', checkUserSigninObjectValid, signinUserController);

// user verify email address
authRouter.post('/email/verify/:id/:token', verifyEmailController);
