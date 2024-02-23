import { NextFunction, Request, Response } from 'express';
import { SignupUserType } from '../models/user.model';
import { prismaDB } from '..';
import { createJwtToken, hashPassword } from '../utils/auth.utils';
import { pick } from 'lodash';
import emailService from '../services/email.service';
import randomstring from 'randomstring';
import { JsonApiResponse } from '../constant.types';

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
      },
    });

    // generate token
    const token = createJwtToken(newUser.id);

    res.status(200).json({
      success: true,
      data: {
        ...pick(newUser, ['name', 'email', 'id', 'emailVerified']),
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
