import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../connection.js";
import AppError from "../../util/AppError.js";

interface CustomRequest extends Request {
  user?: any;
}

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(
        new AppError(
          "Authentication required. Please log in to get access",
          401
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const query = 'SELECT * FROM "user" WHERE user_id = $1';

    // const user = await pool.query(query, [decoded._id])
    const user = await pool.query(query, [15]);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(error);
  }
};
