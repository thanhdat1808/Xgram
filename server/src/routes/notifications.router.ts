import { Router } from 'express'
import StoriesController from '@/controllers/stories.controller'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { CreateStories } from '@/dtos/stories.dto'

class NotificationRouter implements Routes {
  public path = '/notifications'
  public router = Router()
  public storiesController = new StoriesController()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.storiesController.getStories)
    this.router.get(`${this.path}/:id`, authMiddleware, this.storiesController.getStoriesById)
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateStories, 'body'), this.storiesController.createStories)
    this.router.delete(`${this.path}/:id/medias/:media_id`, authMiddleware, this.storiesController.deleteStoriesMedia)
  }
}

export default NotificationRouter
