import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import notificationController from '@/controllers/notifications.controller'
class NotificationRouter implements Routes {
  public path = '/notifications'
  public router = Router()
  public notificationController = new notificationController()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.notificationController.getNotification)
  }
}

export default NotificationRouter
