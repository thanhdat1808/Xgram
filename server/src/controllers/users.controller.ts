import { Response } from 'express'
import { PasswordDto, UpdateUserDto } from '@dtos/users.dto'
import { User, UserFormat } from '@interfaces/users.interface'
import userService from '@services/users.service'
import { resError, resSuccess } from '@utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatPost, formatUser, formatFollow } from '@/utils/formatData'
import { PostFormat } from '@/interfaces/posts.interface'
import { NotificationType, statusCode } from '@/utils/statuscode'
import { CreateNotification } from '@/interfaces/notifications.interface'
import NotificationsService from '@/services/notifications.service'
import { sendNotification } from '@/socket/events'
import { app } from '@/socket/index.socket'
import { io } from '@/server'

class UsersController {
  public userService = new userService()
  public notificationService = new NotificationsService()

  public getUsers = async (req: RequestWithUser, res: Response) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser()
      resSuccess(res, findAllUsersData, 'finAll')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public getUserById = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const findOneUserData: UserFormat = await this.userService.findUserById(userId)
      resSuccess(res, formatUser(findOneUserData), 'findOne')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public getBlockUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const getBlockUser: User[] = await this.userService.getBlockUser(userId)
      resSuccess(res, getBlockUser.map(user => formatFollow(user)), 'finAll')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public getProfilePost = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const page: string = req.query.page as string || '1'
      const getProfilePosts: PostFormat[] = await this.userService.getProfilePosts(userId, page)
      resSuccess(res, getProfilePosts.map(post => formatPost(post)), 'Get posts')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public updateUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const userData: UpdateUserDto = req.body
      const updateUserData: UserFormat = await this.userService.updateUser(userId, userData)
      resSuccess(res, formatUser(updateUserData), 'updated')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.params.id
      const deleteUserData: UserFormat = await this.userService.deleteUser(userId)
      resSuccess(res, formatUser(deleteUserData), 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public followUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: UserFormat = await this.userService.followUser(userId, followId)
      const data: CreateNotification = {
        user: followId,
        to_user: userId,
        type: NotificationType.FOLLOW,
        ref_comment: null,
        ref_post: null,
        ref_user: userId,
        post_id: null
      }
      const createNotif = await this.notificationService.createNotification(data)
      sendNotification(app, followId, createNotif, io)
      resSuccess(res, formatUser(addFollow), 'Add success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public unFollowUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: UserFormat = await this.userService.unFollowUser(userId, followId)
      resSuccess(res, formatUser(addFollow), 'UnFollow success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public removefollowUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const followId: string = req.params.id
      const addFollow: UserFormat = await this.userService.removeFollowUser(userId, followId)
      resSuccess(res, formatUser(addFollow), 'Remove success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public updatePassword = async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.user._id.valueOf()
      const dataPassword: PasswordDto = req.body
      const updatePassword: UserFormat = await this.userService.updatePassword(userId, dataPassword)
      resSuccess(res, formatUser(updatePassword), 'updated')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public blockUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const blockId: string = req.params.id
      const blockUser: UserFormat = await this.userService.blockUser(userId, blockId)
      resSuccess(res, formatUser(blockUser), 'Blocked')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public unBlockUser = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const blockId: string = req.params.id
      const blockUser: UserFormat = await this.userService.unBlockUser(userId, blockId)
      resSuccess(res, formatUser(blockUser), 'Unblocked')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public searchUsers = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const name: string = req.query.q as string
      const page: string = req.query.page as string || '1'
      const serachUsers: UserFormat[] = await this.userService.searchUsers(userId, name, page)
      resSuccess(res, serachUsers.map(user => formatUser(user)), 'Result search')
    } catch (error) {
      resSuccess(res, [], error.message)
    }
  }
}

export default UsersController
