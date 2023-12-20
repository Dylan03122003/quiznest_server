import { User } from '@prisma/client'
import { Request } from 'express'

export interface CustomRequest extends Request {
  user: User
}

export interface InputUser {
  clerkID: string
  name: string
  email: string
  password: string
  photo: string
}
