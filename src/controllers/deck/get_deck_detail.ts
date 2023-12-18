import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const getDeckDetail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deckID } = req.params
    const deck = await prisma.deck.findUnique({
      where: {
        deckID,
      },
      include: {
        questions: {
          include: { flashCard: true, clozeCard: true, multipleChoices: true },
        },
      },
    })
    sendResponse(res, 200, 'success', 'Get deck details successfully', deck)
  } catch (error) {
    return next(error)
  }
}
