import { NextFunction, Request, Response } from 'express';
import { signupUserModel } from '../models/user.model';
import { z } from 'zod';
import { JsonApiResponse } from '../constant.types';

export async function checkUserSignupObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    signupUserModel.parse(user);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.error(err);

      next(err);
    }
  }
}
