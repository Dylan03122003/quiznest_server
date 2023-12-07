import { Response } from 'express'
import { sendErrorResponse } from '../../util/sendErrorResponse.js'

export function handleTokenExpiredError(error: any, res: Response) {
  const expiredAt = new Date(error.expiredAt).toLocaleTimeString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  })

  const message = `Sorry, your session has expired. Please log in again. (Token expired at ${expiredAt})`
  error.statusCode = 401
  return sendErrorResponse(message, res, error)
}
