import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const updateDeckTitle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deckID } = req.params
    const { title } = req.body

    if (!title || title.trim().length === 0) {
      return sendResponse(res, 400, 'fail', 'Invalid title')
    }

    await prisma.deck.update({
      data: {
        title,
      },
      where: {
        deckID,
      },
    })

    return sendResponse(res, 200, 'success', 'Updated title successfully')
  } catch (error) {
    return next(error)
  }
}
