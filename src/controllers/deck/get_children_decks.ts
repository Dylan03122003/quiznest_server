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
    const userId = req.user.userID

    let { parentDeckID } = req.params

    if (!parentDeckID || parentDeckID === 'null') parentDeckID = null

    const decks = await prisma.deck.findMany({
      where: {
        parentDeckID: parentDeckID,
        userID: userId,
      },
    })
    sendResponse(
      res,
      200,
      'success',
      'Getting child decks successfully!',
      decks,
    )
  } catch (error) {
    return next(error)
  }
}
