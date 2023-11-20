import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "./../../util/sendErrorResponse.js";
import { handleDuplicatedError } from "./duplicated_error.js";
import { handleTokenExpiredError } from "./token_expired_error.js";
import { handleValidationError } from "./validation_error.js";

export function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  error.statusCode = error.statusCode || 500;

  if (error.name === "ValidationError") {
    return handleValidationError(error, res);
  }

  if (error.code === 11000) {
    return handleDuplicatedError(error, res);
  }

  if (error.name === "TokenExpiredError") {
    return handleTokenExpiredError(error, res);
  }

  sendErrorResponse(error.message, res, error);
}
