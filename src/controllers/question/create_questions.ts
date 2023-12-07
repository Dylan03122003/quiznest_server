import { NextFunction, Response } from 'express'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'
import { CreateDeckRequest } from '../deck/create_deck.js'

export const createQuestions = async (
  req: CreateDeckRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { questions, deckID } = req.body

    const questionsPromises = questions.map((q) => {
      if (q.type === 'CLOZE_CARD') {
        return prisma.question.create({
          data: {
            type: 'CLOZE_CARD',
            deckID,
            clozeCard: {
              create: {
                content: q.content,
                answers: q.answers,
              },
            },
          },
        })
      } else if (q.type === 'FLASHCARD') {
        return prisma.question.create({
          data: {
            type: 'FLASHCARD',
            deckID,
            flashCard: {
              create: {
                content: q.content,
                back: q.back,
              },
            },
          },
        })
      } else if (q.type === 'MULTIPLE_CHOICE') {
        return prisma.question.create({
          data: {
            type: 'MULTIPLE_CHOICE',
            deckID,
            multipleChoices: {
              create: {
                content: q.content,
                choices: q.choices,
                answers: q.answers,
              },
            },
          },
        })
      }
    })
    await Promise.all(questionsPromises)

    sendResponse(res, 200, 'success', 'Created questions successfully')
  } catch (error) {
    return next(error)
  }
}
