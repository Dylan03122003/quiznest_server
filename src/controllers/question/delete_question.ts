import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const deleteQuestion = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { questionID } = req.params

    await prisma.question.delete({
      where: { questionID },
    })

    sendResponse(res, 200, 'success', 'Deleted question successfully')
  } catch (error) {
    return next(error)
  }
}
