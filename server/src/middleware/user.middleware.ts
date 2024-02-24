import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse } from '../constant.types';
import { userPasswordUpdateModel } from '../models/user.model';
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
