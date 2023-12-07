import express from 'express'
import { login, validateLoginData } from '../controllers/auth/log_in.js'
import { logout } from '../controllers/auth/log_out.js'
import { signup, validateSignupData } from '../controllers/auth/sign_up.js'
const router = express.Router()

router.post('/sign-up', validateSignupData, signup)
router.post('/log-in', validateLoginData, login)
router.post('/log-out', logout)

export default router
