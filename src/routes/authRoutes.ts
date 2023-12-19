import { User } from '@prisma/client'
import express, { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { getMaxAge } from '../util/cookies.js'
import { createToken } from '../util/createToken.js'
import { prisma } from '../util/prisma_client.js'

const router = express.Router()

const getUserData = async (access_token: string) => {
  const reponse = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
  )
  const data = await reponse.json()
  return data
}

router.get('/', async (req: Request, res: Response) => {
  const code = req.query.code
  try {
    const redirectURL = 'http://127.0.0.1:3000/oauth'

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL,
    )

    const response = await oAuth2Client.getToken(code as string)
    await oAuth2Client.setCredentials(response.tokens)
    const user = oAuth2Client.credentials
    const userInfo = await getUserData(user.access_token)

    // res.cookie('access_token', user.access_token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: getMaxAge(),
    // })

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    })

    let responsedUser: User

    if (!existingUser) {
      responsedUser = await prisma.user.create({
        data: {
          clerkID: Date.now() + '',
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
          password: 'NO PASSWORD',
        },
      })
    } else {
      responsedUser = await prisma.user.update({
        where: {
          email: userInfo.email,
        },
        data: {
          name: userInfo.name,
          photo: userInfo.picture,
        },
      })
    }

    delete responsedUser.password

    const token = createToken(responsedUser.userID)

    res.cookie('access_token', token, {
      domain: 'localhost',
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: getMaxAge(),
    })

    res.redirect(
      `${process.env.CLIENT_URL}/log-in/?userInfo=${JSON.stringify(
        responsedUser,
      )}`,
    )
  } catch (error) {
    console.log('error: ', error)
  }
})

export default router
