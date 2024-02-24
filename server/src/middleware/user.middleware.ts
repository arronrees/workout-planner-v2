import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse } from '../constant.types';
import {
  userDetailsUpdateModel,
  userPasswordUpdateModel,
  userProfileUpdateModel,
} from '../models/user.model';
import { z } from 'zod';

export async function checkUserPasswordUpdateObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    userPasswordUpdateModel.parse(user);

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

export async function checkUserDetailsUpdateObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    userDetailsUpdateModel.parse(user);

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

export async function checkUserProfileUpdateObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { profile } = req.body;

    userProfileUpdateModel.parse(profile);

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
