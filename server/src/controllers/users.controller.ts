import { Response } from 'express'
import { CreateUserDto } from '@dtos/users.dto'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'

class UsersController {
  public userService = new userService()

  public getUsers = async (req: RequestWithUser, res: Response) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser()
      resSuccess(res, findAllUsersData, 'finAll')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public getUserById = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const findOneUserData: User = await this.userService.findUserById(userId)
      resSuccess(res, findOneUserData, 'findOne')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public createUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userData: CreateUserDto = req.body
      const avatar: Express.Multer.File = req.file      
      const createUserData: User = await this.userService.createUser(userData, avatar)
      resSuccess(res, createUserData, 'created')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public updateUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const userData: CreateUserDto = req.body
      const updateUserData: User = await this.userService.updateUser(userId, userData)
      resSuccess(res, updateUserData, 'updated')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const deleteUserData: User = await this.userService.deleteUser(userId)
      resSuccess(res, deleteUserData, 'deleted')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public followUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: User = await this.userService.followUser(userId, followId)
      resSuccess(res, addFollow, 'Add success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public unFollowUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: User = await this.userService.unFollowUser(userId, followId)
      resSuccess(res, addFollow, 'UnFollow success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }
}

export default UsersController
