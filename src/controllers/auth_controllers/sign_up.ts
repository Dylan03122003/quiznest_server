import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import AppError from '../../util/AppError.js'
import { getMaxAge } from '../../util/cookies.js'
import { createToken } from '../../util/createToken.js'
import { excludeFields } from '../../util/excludeFields.js'
import { prisma } from '../../util/prisma_client.js'

export const validateSignupData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.password.length < 8)
      return next(new AppError('Must be at least 8 characters', 400))

    if (req.body.password !== req.body.passwordConfirm)
      return next(new AppError('Passwords do not match', 400))

    return next()
  } catch (error) {
    return next(error)
  }
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12)

    let newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'user',
      },
    })

    newUser = excludeFields(newUser, ['password'])

    const token = createToken(newUser.user_id)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: getMaxAge(),
    })

    res.status(201).json({
      status: 'success',
      message: 'Signed up successfully',
      user: newUser,
    })
  } catch (error) {
    return next(error)
  }
}
