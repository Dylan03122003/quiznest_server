import { Response } from 'express'

export function sendErrorResponse(message: string, res: Response, error: any) {
  const responseObject =
    process.env.NODE_ENV === 'production'
      ? {
          status: 'fail',
          message,
        }
      : {
          status: 'fail',
          message,
          error,
        }

  return res.status(error.statusCode).json(responseObject)
}
