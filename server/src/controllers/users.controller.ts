import { NextFunction, Request, Response } from 'express'
import { CreateUserDto, LoginUser } from '@dtos/users.dto'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'
import { statusCode } from '@utils/statuscode'

class UsersController {
  public userService = new userService()

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser()

      res.status(statusCode.OK).json({ data: findAllUsersData, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id
      const findOneUserData: User = await this.userService.findUserById(userId)

      res.status(statusCode.OK).json({ data: findOneUserData, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body
      const createUserData: User = await this.userService.createUser(userData)

      res.status(statusCode.CREATED).json({ data: createUserData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id
      const userData: CreateUserDto = req.body
      const updateUserData: User = await this.userService.updateUser(userId, userData)

      res.status(200).json({ data: updateUserData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id
      const deleteUserData: User = await this.userService.deleteUser(userId)

      res.status(200).json({ data: deleteUserData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default UsersController
