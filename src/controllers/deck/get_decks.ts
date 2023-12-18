import { Deck } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

interface ExtendedDeck extends Deck {
  totalQuestions: number
  childDecks: ExtendedDeck[]
}

export const getAllDecks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUser = req.user
    const { parentDeckID } = req.query
    const parentDeckIDString = Array.isArray(parentDeckID)
      ? parentDeckID[0]
      : parentDeckID

    const topLevelDecks = await prisma.deck.findMany({
      where: {
        parentDeckID: parentDeckIDString ? parentDeckIDString : null,
        userID: currentUser.userID,
      },
    })

    const decks = await Promise.all(
      topLevelDecks.map((deck) => fetchDeckWithChildren(deck.deckID)),
    )

    sendResponse(res, 200, 'success', 'Getting decks successfully!', decks)
  } catch (error) {
    return next(error)
  }
}

const fetchDeckWithChildren = async (deckID: string) => {
  const deck: ExtendedDeck = (await prisma.deck.findUnique({
    where: { deckID },
    include: {
      childDecks: true,
    },
  })) as ExtendedDeck

  if (!deck) {
    return null
  }
  // const allChildDeckIds = await getAllChildDeckIds(deck.deckID)

  // const {
  //   _count: { questionID: totalQuestions },
  // } = await prisma.question.aggregate({
  //   _count: {
  //     questionID: true,
  //   },
  //   where: {
  //     deckID: {
  //       // in: [deck.deckID, ...allChildDeckIds],
  //       in: [deck.deckID],
  //     },
  //   },
  // })

  deck.totalQuestions = 0

  const childDecks = await Promise.all(
    deck.childDecks.map((childDeck) => fetchDeckWithChildren(childDeck.deckID)),
  )

  return { ...deck, childDecks }
}
