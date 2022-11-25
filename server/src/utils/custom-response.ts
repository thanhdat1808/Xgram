import { Response } from 'express'
import { statusCode } from './statuscode'

export const resSuccess = (res: Response, data: Object, message: string) => {
  return res.status(statusCode.OK).json({
    status: 'OK',
    message: message,
    data: data
  })
}
export const resError = (res: Response, message: string, status: number) => {
  return res.status(status).json({
    status: 'ERROR',
    message: message
  })
}
