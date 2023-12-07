import { Response } from 'express'

export const sendResponse = (
  res: Response,
  statusCode: number,
  status: 'success' | 'fail',
  message: string,
  data?: any,
) => {
  res.status(statusCode).json({
    status,
    message,
    data,
  })
}
