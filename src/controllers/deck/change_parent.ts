import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const changeParent = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { parentDeckID, childDeckID } = req.body

    await prisma.deck.update({
      data: {
        parentDeckID,
      },
      where: {
        deckID: childDeckID,
      },
    })

    sendResponse(res, 200, 'success', 'Change parent successfully')
  } catch (error) {
    return next(error)
  }
}
