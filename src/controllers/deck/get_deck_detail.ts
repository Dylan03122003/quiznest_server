import { Deck, Question } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

interface DeckDetail extends Deck {
  questions: Question[]
}

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
    })

    const deckDetail: DeckDetail = { ...deck, questions: [] }

    const questions = await getQuestionsRecursive(deckID)

    deckDetail.questions = questions

    sendResponse(
      res,
      200,
      'success',
      'Get deck details successfully',
      deckDetail,
    )
  } catch (error) {
    return next(error)
  }
}

// Helper function to recursively get questions for a deck and its child decks
async function getQuestionsRecursive(deckID: string): Promise<Question[]> {
  const deck = await prisma.deck.findUnique({
    where: { deckID },
    include: {
      questions: {
        include: {
          flashCard: true,
          clozeCard: true,
          multipleChoices: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      childDecks: { include: { questions: true } },
    },
  })

  if (!deck) {
    console.error('Deck not found')
    return []
  }

  const questions = deck.questions || []
  const childDeckQuestions = await Promise.all(
    deck.childDecks.map((childDeck) => getQuestionsRecursive(childDeck.deckID)),
  )

  // Use the spread operator to concatenate arrays
  return [...questions, ...childDeckQuestions.flat()]
}
