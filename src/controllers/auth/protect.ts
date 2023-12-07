import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { CustomRequest } from '../../types.js'
import AppError from '../../util/AppError.js'
import { prisma } from '../../util/prisma_client.js'

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token

    if (!token) {
      return next(
        new AppError(
          'Authentication required. Please log in to get access',
          401,
        ),
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const user = await prisma.user.findFirst({
      where: { userID: decoded._id },
    })

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    req.user = user

    next()
  } catch (error) {
    return next(error)
  }
}
