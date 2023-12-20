import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export interface CreateDeckRequest extends CustomRequest {
  body: {
    deckID: string
    parentDeckID: string
    title: string
    questions: any
  }
}

export const createDeck = async (
  req: CreateDeckRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.user.userID

    if (!userID) {
      return sendResponse(res, 400, 'fail', 'Please login to get access!')
    }
    const { parentDeckID, title, questions } = req.body

    const newDeck = await prisma.deck.create({
      data: {
        title,
        parentDeckID: parentDeckID || null,
        userID: userID,
      },
    })

    const hasQuestions = questions && questions.length > 0
    if (!hasQuestions) {
      return sendResponse(res, 200, 'success', 'Created deck.', newDeck)
    } else {
      req.body.deckID = newDeck.deckID
      next()
    }
  } catch (error) {
    return next(error)
  }
}

export const validateCreateDeckData = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body
    if (!title) return sendResponse(res, 400, 'fail', 'Must provide a title')

    if (title.length < 5)
      return sendResponse(
        res,
        400,
        'fail',
        'Title length must be greater than 4',
      )

    next()
  } catch (error) {
    return next(error)
  }
}
