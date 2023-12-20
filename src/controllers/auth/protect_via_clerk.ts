import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

interface ProtectRequest extends CustomRequest {
  auth: any
}

export const protectViaClerk = async (
  req: ProtectRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clerkID = req.auth && req.auth.userId
    if (!clerkID) {
      return sendResponse(
        res,
        400,
        'fail',
        `Please login to get access! clerkID = ${clerkID}`,
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkID },
    })

    if (!user) {
      return sendResponse(
        res,
        400,
        'fail',
        `There is no user with the clerkID = ${clerkID}`,
      )
    }

    req.user = user
    next()
  } catch (error) {
    return next(error)
  }
}
