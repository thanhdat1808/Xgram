import { Response } from 'express'
import { statusCode } from './statuscode'

export const resSuccess = (res: Response, data: Object, message: string) => {
  return res.status(statusCode.OK).json({
    status: 'OK',
    message: message,
    data: data
  })
}
export const resError = (res: Response, message: string, statusCode: number) => {
  return res.status(statusCode).json({
    status: 'ERROR',
    message: message,
    data: {}
  })
}
export const formatRes = (data: Object, status: string) => {
  return {
    status: status,
    data: data
  }
}
