import { prismaDB } from '..';
import { Request, Response, NextFunction } from 'express';
import {
  UserDetailsUpdateType,
  UserPasswordUpdateType,
  UserPreferencesUpdateType,
  UserProfileUpdateType,
} from '../models/user.model';
import emailService from '../services/email.service';
import { comparePassword, hashPassword } from '../utils/auth.utils';
import { JsonApiResponse, ResLocals } from '../constant.types';
import randomstring from 'randomstring';

// PUT /update/password
export async function updateUserPasswordController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals },
  next: NextFunction
) {
  try {
    const { user: currentUser } = res.locals;
    const { user }: { user: UserPasswordUpdateType } = req.body;

    console.log(user, currentUser);

    if (!currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // compare passwords
    const passwordCheck = await comparePassword(
      user.password,
      currentUser.password
    );

    if (passwordCheck) {
      return res.status(400).json({
        success: false,
        error: 'New password cannot be the same as current password',
      });
    }

    const hash = await hashPassword(user.password);

    const updatedUser = await prismaDB.user.update({
      where: { id: currentUser.id },
      data: {
        password: hash,
      },
    });

    res.status(200).json({ success: true });

    // send email notification
    const passwordNotificationMessage =
      await emailService.sendPasswordUpdateNotification({
        email: currentUser.email,
        name: currentUser.name,
      });

    return;
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// PUT /update/details
export async function updateUserDetailsController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals },
  next: NextFunction
) {
  try {
    const { user: currentUser } = res.locals;
    const { user }: { user: UserDetailsUpdateType } = req.body;

    if (!currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // is email new?
    const isEmailNew: boolean = user.email !== currentUser.email;

    if (isEmailNew) {
      const isEmailRegistered = await prismaDB.user.findUnique({
        where: { email: user.email },
      });

      if (isEmailRegistered) {
        return res
          .status(400)
          .json({ success: false, error: 'Email already registered' });
      }
    }

    const randomString = randomstring.generate();

    const updatedUser = await prismaDB.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
        email: user.email,
        emailVerified: isEmailNew ? false : currentUser.emailVerified,
        emailVerificationString: isEmailNew ? randomString : null,
      },
    });

    res.status(200).json({ success: true });

    // send verification email
    const verificationEmailMessage = await emailService.sendEmailVerification({
      email: updatedUser.email,
      id: updatedUser.id,
      name: updatedUser.name,
      randomString,
    });

    return;
  } catch (err) {
    console.error(err);

    next(err);
  }
}

export async function updateUserProfileController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals },
  next: NextFunction
) {
  try {
    const { user } = res.locals;
    const { profile }: { profile: UserProfileUpdateType } = req.body;

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedProfile = await prismaDB.userProfile.update({
      where: { userId: user.id },
      data: {
        avatarUrl: profile.avatarUrl,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    next(err);
  }
}

export async function updateUserPreferencesController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals },
  next: NextFunction
) {
  try {
    const { user } = res.locals;
    const { preferences }: { preferences: UserPreferencesUpdateType } =
      req.body;

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedUser = await prismaDB.userPreference.update({
      where: { userId: user.id },
      data: {
        theme: preferences.theme,
        weightUnit: preferences.weightUnit,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    next(err);
  }
}
