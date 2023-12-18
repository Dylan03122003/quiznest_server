import express from 'express'
import { protect } from '../controllers/auth/protect.js'
import { deleteQuestion } from '../controllers/question/delete_question.js'
import { updateCard } from '../controllers/question/update_card.js'

const router = express.Router()

router.route('/cards/:cardID').patch(protect, updateCard)

router.route('/:questionID').delete(protect, deleteQuestion)

export default router
