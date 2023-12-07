import express, { Request, Response } from 'express'
import passport from 'passport'
import { sendResponse } from '../util/sendResponse.js'
const router = express.Router()

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed',
  }),
)

router.get('/logout', (req: Request, res: Response) => {
  //   req.logout()
  res.redirect(process.env.CLIENT_URL)
})

router.get('/login/failed', (req: Request, res: Response) => {
  sendResponse(res, 401, 'fail', 'login failed')
})

router.get('/login/success', (req: Request, res: Response) => {
  if (req.user) {
    sendResponse(res, 200, 'success', 'login successfully', {
      user: req.user,
      // cookies
      // token
    })
  }
})

export default router
