import express from 'express'
import {
  login,
  validateLoginData,
} from '../controllers/auth_controllers/log_in.js'
import { logout } from '../controllers/auth_controllers/log_out.js'
import {
  signup,
  validateSignupData,
} from '../controllers/auth_controllers/sign_up.js'
const router = express.Router()

router.post('/sign-up', validateSignupData, signup)
router.post('/log-in', validateLoginData, login)
router.post('/log-out', logout)

export default router
