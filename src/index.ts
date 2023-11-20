import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import { protect } from './controllers/auth_controllers/protect.js'
import { globalErrorHandler } from './controllers/error_controllers/index.js'
import userRoutes from './routes/userRoutes.js'

config()

const app = express()

// SET UP MIDDLEWARES  ----------------------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies)
  }),
)
app.use(express.json())
app.use(cookieParser())

// app.use(express.static("public"));

// ROUTES ---------------------------------------------------------------------------

app.use('/api/users', userRoutes)

app.get('/api/test', protect, (req, res) => {
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
