import { HttpException } from '@exceptions/HttpException'
import userModel from '@/models/users.model'
import notificationModel from '@/models/notif.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { User } from '@/interfaces/users.interface'
import { CustomError } from '@/utils/custom-error'
import { CreateNotification, Notification } from '@/interfaces/notifications.interface'
class NotificationsService {
  public notifications = notificationModel
  public users = userModel
  public populate = ['user', 'ref_user', 'ref_post', 'ref_comment']

  public async getNotifications(userId: string): Promise<Notification[]> {
    try {
      if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty')
      const findUser: User = await this.users.findOne({_id: userId})
      if(!findUser) throw new HttpException(statusCode.CONFLICT, 'User doesn\'t exist')
      const notif: Notification[] = await this.notifications.find({ to_user: userId }).sort({'created_at': -1}).populate(this.populate)
      return notif
    } catch (error) {
      throw new CustomError(error, {}, statusCode.NOT_IMPLEMENTED)
    }
  }

  public async createNotification(notificationData: CreateNotification) {
    try {
      if (isEmpty(notificationData)) throw new HttpException(400, 'Data is empty')
      const createNotification: Notification = await (await this.notifications.create({ ...notificationData })).populate(this.populate)
      return createNotification
    }
    catch (error) {
      console.log(error)
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async deleteNotification(notificationId: string): Promise<Notification> {
    try {
      const deleteNotification: Notification = await this.notifications.findByIdAndDelete(notificationId)
      if (!deleteNotification) throw new HttpException(409, 'Notification doesn\'t exist')
      return deleteNotification
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
}

export default NotificationsService
