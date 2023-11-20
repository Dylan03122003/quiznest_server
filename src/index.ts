import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
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

app.all('*', function (req, res) {
  res.status(401).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  })
})

// GLOBAL MIDDLEWARE -------------------------------------------------------------------

app.use(globalErrorHandler)

// Database connection and listening to incoming requests --------------------------------
// const database = process.env.MONGO_URL

const PORT = process.env.PORT || 3000
// mongoose.connect(database).then(() => {
//   console.log('Successfully connected to database')
//   app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`)
//   })
// })
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
