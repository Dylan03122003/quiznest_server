import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const getChildrenDecks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUser = req.user
    const { parentDeckID } = req.params

    const decks = await prisma.deck.findMany({
      where: {
        parentDeckID,
        userID: currentUser.userID,
      },
    })
    sendResponse(res, 200, 'success', 'Getting decks successfully!', decks)
  } catch (error) {
    return next(error)
  }
}
