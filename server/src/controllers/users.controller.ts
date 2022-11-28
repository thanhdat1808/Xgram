import { Response } from 'express'
import { PasswordDto, UpdateUserDto } from '@dtos/users.dto'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatUser } from '@/utils/formatData'

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
      resSuccess(res, formatUser(findOneUserData), 'findOne')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public updateUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const userData: UpdateUserDto = req.body
      const updateUserData: User = await this.userService.updateUser(userId, userData)
      resSuccess(res, formatUser(updateUserData), 'updated')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const deleteUserData: User = await this.userService.deleteUser(userId)
      resSuccess(res, formatUser(deleteUserData), 'deleted')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public followUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: User = await this.userService.followUser(userId, followId)
      resSuccess(res, formatUser(addFollow), 'Add success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public unFollowUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: User = await this.userService.unFollowUser(userId, followId)
      resSuccess(res, formatUser(addFollow), 'UnFollow success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public updatePassword = async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.user._id.valueOf()
      const dataPassword: PasswordDto = req.body
      const updatePassword: User = await this.userService.updatePassword(userId, dataPassword)
      resSuccess(res, formatUser(updatePassword), 'updated')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }
}

export default UsersController
