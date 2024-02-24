import { NextFunction, Request, Response } from 'express';
import { SigninUserType, SignupUserType } from '../models/user.model';
import { prismaDB } from '..';
import {
  comparePassword,
  createJwtToken,
  hashPassword,
} from '../utils/auth.utils';
import { pick } from 'lodash';
import emailService from '../services/email.service';
import randomstring from 'randomstring';
import { JsonApiResponse } from '../constant.types';
import { isValidUuid } from '../utils/index.utils';

// POST /signup
export async function signupUserController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user }: { user: SignupUserType } = req.body;

    // check if user already exists in db
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    // user exists, create password hash
    const hash = await hashPassword(user.password);

    const randomString = randomstring.generate();

    const newUser = await prismaDB.user.create({
      data: {
        ...user,
        password: hash,
        emailVerificationString: randomString,
        profile: {
          create: {
            avatarUrl: '',
          },
        },
        preferences: {
          create: {},
        },
      },
      include: {
        profile: true,
        preferences: true,
      },
    });

    // generate token
    const token = createJwtToken(newUser.id);

    res.status(200).json({
      success: true,
      data: {
        ...pick(newUser, [
          'name',
          'email',
          'id',
          'emailVerified',
          'profile',
          'preferences',
        ]),
        token,
      },
    });

    // send verification email
    const verificationEmailMessage = await emailService.sendEmailVerification({
      email: newUser.email,
      id: newUser.id,
      name: newUser.name,
      randomString,
    });

    return;
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// POST /signin
export async function signinUserController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
      include: { profile: true, preferences: true },
    });

    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // compare passwords
    const passwordCheck = await comparePassword(
      user.password,
      userExists.password
    );

    if (!passwordCheck) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // generate token
    const token = createJwtToken(userExists.id);

    return res.status(200).json({
      success: true,
      data: {
        ...pick(userExists, [
          'name',
          'email',
          'id',
          'emailVerified',
          'profile',
          'preferences',
        ]),
        token,
      },
    });
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// POST /email/verify/:id/:token
export async function verifyEmailController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { id, token }: { id?: string; token?: string } = req.params;

    if (!id || !token) {
      return res
        .status(400)
        .json({ success: false, error: 'No ID or token provided' });
    }

    if (!isValidUuid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const user = await prismaDB.user.findUnique({ where: { id } });

    console.log(user);

    if (user) {
      if (user.emailVerified) {
        return res.status(200).json({ success: true });
      }

      if (user.emailVerificationString === token) {
        await prismaDB.user.update({
          where: { id },
          data: { emailVerified: true, emailVerificationString: null },
        });

        res.status(200).json({ success: true });

        // send email verified email
        const verifiedEmailMessage = await emailService.sendEmailVerified({
          email: user.email,
          name: user.name,
        });

        return;
      }
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid request',
    });
  } catch (err) {
    console.error(err);

    next(err);
  }
}
