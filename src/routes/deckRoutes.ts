import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import express from 'express'
import { protectViaClerk } from '../controllers/auth/protect_via_clerk.js'
import { changeParent } from '../controllers/deck/change_parent.js'
import {
  createDeck,
  validateCreateDeckData,
} from '../controllers/deck/create_deck.js'
import { deleteDeck } from '../controllers/deck/delete_deck.js'
import { getChildrenDecks } from '../controllers/deck/get_children_decks.js'
import { getDeckDetail } from '../controllers/deck/get_deck_detail.js'
import { getAllDecks } from '../controllers/deck/get_decks.js'
import { updateDeckTitle } from '../controllers/deck/update_deck_title.js'
import { createAQuestion } from '../controllers/question/create_a_question.js'
import { createQuestions } from '../controllers/question/create_questions.js'

const router = express.Router()

router
  .route('/')
  .post(
    ClerkExpressWithAuth(),
    protectViaClerk,
    validateCreateDeckData,
    createDeck,
    createQuestions,
  )
  .get(ClerkExpressWithAuth(), protectViaClerk, getAllDecks)

router.post(
  '/change-parent',
  ClerkExpressWithAuth(),
  protectViaClerk,
  changeParent,
)

router
  .route('/:deckID')
  .post(ClerkExpressWithAuth(), protectViaClerk, createAQuestion)
  .delete(ClerkExpressWithAuth(), protectViaClerk, deleteDeck)
  .patch(ClerkExpressWithAuth(), protectViaClerk, updateDeckTitle)
  .get(ClerkExpressWithAuth(), protectViaClerk, getDeckDetail)

router.get(
  '/children-decks/:parentDeckID',
  ClerkExpressWithAuth(),
  protectViaClerk,
  getChildrenDecks,
)

export default router
