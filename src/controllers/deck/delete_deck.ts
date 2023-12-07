import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { getAllChildDeckIds } from '../../util/decks.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const deleteDeck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deckID } = req.params

    const childDeckIDs = await getAllChildDeckIds(deckID)

    await prisma.deck.deleteMany({
      where: {
        deckID: {
          in: [deckID, ...childDeckIDs],
        },
      },
    })

    sendResponse(res, 200, 'success', 'Deleted deck successfully')
  } catch (error) {
    return next(error)
  }
}
