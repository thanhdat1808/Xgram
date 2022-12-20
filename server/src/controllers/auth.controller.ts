import { NextFunction, Request, Response } from 'express'
import { CreateUserDto } from '@dtos/users.dto'
import { RequestWithUser } from '@interfaces/auth.interface'
import { User } from '@interfaces/users.interface'
import AuthService from '@services/auth.service'
import { formatUser } from '@/utils/formatData'
import { resError, resSuccess } from '@/utils/custom-response'
import { statusCode } from '@/utils/statuscode'

class AuthController {
  public authService = new AuthService()

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body
      const {cookie, createUserData} = await this.authService.signup(userData)
      res.setHeader('Set-Cookie', [cookie])
      resSuccess(res,  {cookie, user: formatUser(createUserData)}, 'signup')
    } catch (error) {
      next(error)
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body
      const { cookie, findUser } = await this.authService.login(userData)

      res.setHeader('Set-Cookie', [cookie])
      resSuccess(res, {cookie, user: formatUser(findUser)}, 'login')
    } catch (error) {
      next(error)
    }
  }

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user
      const logOutUserData: User = await this.authService.logout(userData)

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
      resSuccess(res, formatUser(logOutUserData), 'logout')
    } catch (error) {
      next(error)
    }
  }

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email
      await this.authService.forgotPassword(email)
      resSuccess(res, {},  'Mail sended your email')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public resetPassword = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.userId
      const token: string = req.params.token
      await this.authService.resetPassword(userId, token)
      res.send('Mail sended your email')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default AuthController
