import { User } from '@prisma/client'
import { config } from 'dotenv'
import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import { prisma } from './util/prisma_client.js'
config()

const GoogleStrategy = passportGoogle.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        })

        let responsedUser: User

        if (!existingUser) {
          responsedUser = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              photo: profile.photos[0].value,
              password: 'NO PASSWORD',
            },
          })
        } else {
          responsedUser = await prisma.user.update({
            where: {
              email: profile.emails[0].value,
            },
            data: {
              name: profile.displayName,
              photo: profile.photos[0].value,
            },
          })
        }

        // Call the done callback with the user object
        done(null, responsedUser) // ! BUG HERE
      } catch (error) {
        // Handle errors by passing them to the done callback
        done(error)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
