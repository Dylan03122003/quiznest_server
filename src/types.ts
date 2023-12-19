import { Request } from 'express'

export interface CustomRequest extends Request {
  user?: any
}

export interface InputUser {
  clerkID: string
  name: string
  email: string
  password: string
  photo: string
}
