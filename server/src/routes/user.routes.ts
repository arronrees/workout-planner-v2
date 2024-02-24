import { Router } from 'express';
import {
  checkUserDetailsUpdteObjectValid,
  checkUserPasswordUpdateObjectValid,
} from '../middleware/user.middleware';
import {
  updateUserDetailsController,
  updateUserPasswordController,
} from '../controllers/user.controller';

export const userRouter = Router();

// update user password
userRouter.put(
  '/update-password',
  checkUserPasswordUpdateObjectValid,
  updateUserPasswordController
);

// update user details
userRouter.put(
  '/update-details',
  checkUserDetailsUpdteObjectValid,
  updateUserDetailsController
);
