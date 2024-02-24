import { Router } from 'express';
import {
  checkUserDetailsUpdateObjectValid,
  checkUserPasswordUpdateObjectValid,
  checkUserProfileUpdateObjectValid,
  checkUserPreferencesUpdateObjectValid,
} from '../middleware/user.middleware';
import {
  updateUserDetailsController,
  updateUserPasswordController,
  updateUserProfileController,
  updateUserPreferencesController,
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
  checkUserDetailsUpdateObjectValid,
  updateUserDetailsController
);

// update user profile
userRouter.put(
  '/update-profile',
  checkUserProfileUpdateObjectValid,
  updateUserProfileController
);

// update user preferences
userRouter.put(
  '/update-preferences',
  checkUserPreferencesUpdateObjectValid,
  updateUserPreferencesController
);
