import { Router } from 'express';
import { checkUserPasswordUpdateObjectValid } from '../middleware/user.middleware';
import { updateUserPasswordController } from '../controllers/user.controller';

export const userRouter = Router();

// update user password
userRouter.put(
  '/update-password',
  checkUserPasswordUpdateObjectValid,
  updateUserPasswordController
);
