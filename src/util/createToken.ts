import jwt from 'jsonwebtoken'

export const createToken = (_id: Number) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}
