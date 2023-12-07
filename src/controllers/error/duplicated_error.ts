import { Response } from 'express'
import { sendErrorResponse } from '../../util/sendErrorResponse.js'

export function handleDuplicatedError(error: any, res: Response) {
  const duplicatedField = Object.keys(error.keyValue)[0]
  const message = `Duplicated ${duplicatedField}`
  error.statusCode = 409
  return sendErrorResponse(message, res, error)
}
