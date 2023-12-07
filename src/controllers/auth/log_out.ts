import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ status: "success", message: "User has been logged out." });
};
