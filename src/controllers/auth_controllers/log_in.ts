import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import pool from "../../connection.js";
import AppError from "../../util/AppError.js";
import { getMaxAge } from "../../util/cookies.js";
import { createToken } from "../../util/createToken.js";

interface CustomRequest extends Request {
  user?: any; // Adjust the type accordingly
}

export const validateLoginData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password: commingPassword } = req.body;
  // 1. Check email and password empty or not
  if (!email || !commingPassword) {
    return next(new AppError("Please provide an email and password", 400));
  }
  // 2. Check email and password is valid or not
  const query = 'SELECT * FROM "user" WHERE email = $1';
  const result = await pool.query(query, [email]);

  const user = result.rows[0];

  if (!user) return next(new AppError("Invalid email or password", 400));

  const isCorrectPassword = await bcrypt.compare(
    commingPassword,
    user.password
  );

  if (!isCorrectPassword)
    return next(new AppError("Invalid email or password", 400));

  req.user = user;
  next();
};

export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = createToken(req.user.user_id);
    req.user.password = undefined;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: getMaxAge(),
    });

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      user: req.user,
    });
  } catch (error) {
    return next(error);
  }
};
