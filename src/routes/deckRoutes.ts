import express from 'express'
import { protect } from '../controllers/auth/protect.js'
import { changeParent } from '../controllers/deck/change_parent.js'
import {
  createDeck,
  validateCreateDeckData,
} from '../controllers/deck/create_deck.js'
import { deleteDeck } from '../controllers/deck/delete_deck.js'
import { getChildrenDecks } from '../controllers/deck/get_children_decks.js'
import { getDecks } from '../controllers/deck/get_decks.js'
import { updateDeckTitle } from '../controllers/deck/update_deck_title.js'
import { createAQuestion } from '../controllers/question/create_a_question.js'
import { createQuestions } from '../controllers/question/create_questions.js'
const router = express.Router()

router
  .route('/')
  .post(protect, validateCreateDeckData, createDeck, createQuestions)
  .get(protect, getDecks)

router.post('/change-parent', protect, changeParent)

router
  .route('/:deckID')
  .post(protect, createAQuestion)
  .delete(protect, deleteDeck)
  .patch(protect, updateDeckTitle)

router.get('/:parentDeckID', protect, getChildrenDecks)

export default router
