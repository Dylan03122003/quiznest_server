import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
} from '@clerk/clerk-sdk-node'
import express from 'express'
import { protectViaClerk } from '../controllers/auth/protect_via_clerk.js'
import { bookmarkQuestion } from '../controllers/question/bookmark.question.js'
import { deleteQuestion } from '../controllers/question/delete_question.js'
import { updateCard } from '../controllers/question/update_card.js'

const router = express.Router()

router
  .route('/cards/:cardID')
  .patch(ClerkExpressWithAuth(), protectViaClerk, updateCard)

router
  .route('/:questionID')
  .delete(ClerkExpressWithAuth(), protectViaClerk, deleteQuestion)

router.get(
  '/:questionID/bookmark',
  ClerkExpressWithAuth(),
  protectViaClerk,
  bookmarkQuestion,
)

export default router
