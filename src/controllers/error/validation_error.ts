import { Response } from 'express'
import { sendErrorResponse } from '../../util/sendErrorResponse.js'

export function handleValidationError(error: any, res: Response) {
  const message = error.message.split(': ')[2]
  error.statusCode = 400
  return sendErrorResponse(message, res, error)
}
