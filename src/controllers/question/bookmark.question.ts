import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const bookmarkQuestion = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { questionID } = req.params

    const question = await prisma.question.findUnique({
      where: {
        questionID,
      },
      select: {
        isBookmarked: true,
      },
    })

    await prisma.question.update({
      where: {
        questionID,
      },
      data: {
        isBookmarked: !question.isBookmarked,
      },
    })

    sendResponse(res, 200, 'success', 'Bookmarked question successfully')
  } catch (error) {
    return next(error)
  }
}
