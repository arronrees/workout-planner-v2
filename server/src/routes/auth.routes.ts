import { Router } from 'express';
import { checkUserSignupObjectValid } from '../middleware/auth.middleware';
import { signupUserController } from '../controllers/auth.controller';

export const authRouter = Router();

// user signup
authRouter.post('/signup', checkUserSignupObjectValid, signupUserController);
