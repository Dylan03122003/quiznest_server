import {
  ClozeCard,
  Flashcard,
  MultipleChoice,
  QuestionType,
} from '@prisma/client'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

export const createAQuestion = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question } = req.body
    const { deckID } = req.params

    if (question.type === QuestionType.CLOZE_CARD) {
      await prisma.question.create({
        data: {
          type: 'CLOZE_CARD',
          deckID,
          clozeCard: {
            create: {
              content: question.content,
              answers: question.answers,
            },
          },
        },
      })
    } else if (question.type === QuestionType.FLASHCARD) {
      await prisma.question.create({
        data: {
          type: 'FLASHCARD',
          deckID,
          flashCard: {
            create: {
              content: question.content,
              back: question.back,
              explanation: question.explanation,
            },
          },
        },
      })
    } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
      await prisma.question.create({
        data: {
          type: 'MULTIPLE_CHOICE',
          deckID,
          multipleChoices: {
            create: {
              content: question.content,
              choices: question.choices,
              answers: question.answers,
            },
          },
        },
      })
    }

    sendResponse(res, 200, 'success', 'Created a question successfully')
  } catch (error) {
    return next(error)
  }
}
