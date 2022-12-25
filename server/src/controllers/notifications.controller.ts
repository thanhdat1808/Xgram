import { Response } from 'express'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatNotification } from '@/utils/formatData'
import { statusCode } from '@/utils/statuscode'
import NotificationsService from '@/services/notifications.service'
import { CreateNotification, Notification } from '@/interfaces/notifications.interface'

class NotificationController {
  public notificationService = new NotificationsService()
  
    public getNotification = async (req: RequestWithUser, res: Response) => {
      try {
        const userId: string = req.user._id.valueOf()
        const getNotification: Notification[] = await this.notificationService.getNotifications(userId)
        resSuccess(res, getNotification.map(notification => formatNotification(notification)), 'Get posts')
      } catch (error) {
        resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
      }
    }

  public createStories = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: CreateNotification = {
        ...req.body,
        posted_by: req.user._id.valueOf()
      }
      const createStory: Notification = await this.notificationService.createNotification(postData)
      resSuccess(res, formatNotification(createStory), 'created')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deleteNotification = async (req: RequestWithUser, res: Response) => {
    try {
      const notifId: string = req.params.id
      const deletePostData: Notification = await this.notificationService.deleteNotification(notifId)
      resSuccess(res, deletePostData, 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default NotificationController
