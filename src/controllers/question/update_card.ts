import {
  ClozeCard,
  Flashcard,
  MultipleChoice,
  Question,
  QuestionType,
} from '@prisma/client'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../../types.js'
import { prisma } from '../../util/prisma_client.js'
import { sendResponse } from '../../util/sendResponse.js'

interface UpdatedQuestion extends Question {
  clozeCard?: ClozeCard | null
  flashCard?: Flashcard | null
  multipleChoices?: MultipleChoice | null
}

interface RequestBody {
  type: QuestionType
  updatedQuestion: UpdatedQuestion
}

export const updateCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardID } = req.params
    const { updatedQuestion }: RequestBody = req.body

    let updatedCard: Flashcard | ClozeCard | MultipleChoice

    switch (updatedQuestion.type) {
      case QuestionType.CLOZE_CARD:
        break
      case QuestionType.FLASHCARD:
        const flashcard = updatedQuestion.flashCard
        updatedCard = await prisma.flashcard.update({
          data: {
            back: flashcard.back,
            content: flashcard.content,
            explanation: flashcard.explanation,
          },
          where: {
            flashcardID: cardID,
          },
        })
        break
      case QuestionType.MULTIPLE_CHOICE:
        const multipleChoice = updatedQuestion.multipleChoices
        updatedCard = await prisma.multipleChoice.update({
          data: {
            answers: multipleChoice.answers,
            choices: multipleChoice.choices,
            content: multipleChoice.content,
          },
          where: {
            multipleChoiceID: cardID,
          },
        })
        break
      default:
        break
    }

    sendResponse(
      res,
      200,
      'success',
      `Updated ${updatedQuestion.type} successfully`,
      updatedCard,
    )
  } catch (error) {
    return next(error)
  }
}
