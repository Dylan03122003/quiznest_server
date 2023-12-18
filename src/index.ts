import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import passport from 'passport'
import { globalErrorHandler } from './controllers/error/index.js'
import './passport.js'
import authRoutes from './routes/authRoutes.js'
import deckRoutes from './routes/deckRoutes.js'
import googleRoutes from './routes/googleRoute.js'
import questionRoutes from './routes/questionRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { ONE_DAY_AGE } from './util/cookies.js'
import { prisma } from './util/prisma_client.js'
config()

const app = express()

// SET UP MIDDLEWARES  ----------------------------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL_PRO,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies)
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use(
  cookieSession({ name: 'session', keys: ['quocduong'], maxAge: ONE_DAY_AGE }),
)

app.use(passport.initialize())
app.use(passport.session())

// app.use(express.static("public"));

// ROUTES ---------------------------------------------------------------------------

app.use('/api/users', userRoutes)
app.use('/api/decks', deckRoutes)
app.use('/api/questions', questionRoutes)
app.use('/request', requestRoutes)
app.use('/oauth', authRoutes)
app.use('/auth', googleRoutes)

app.post('/api/test-prisma', async (req, res) => {
  const user = await prisma.user.findMany()
  res.status(200).json({ user })
})

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'OK' })
})

app.all('*', function (req, res) {
  res.status(401).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  })
})

// GLOBAL MIDDLEWARE -------------------------------------------------------------------

app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
