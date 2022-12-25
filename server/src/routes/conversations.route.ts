import { Router } from 'express'
import ConversationsController from '@/controllers/conversations.controller'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { CreateConversationDto } from '@/dtos/conversations.dto'

class ConversationRoute implements Routes {
  public path = '/conversations'
  public router = Router()
  public conversationsController = new ConversationsController()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.conversationsController.getConversations)
    this.router.get(`${this.path}/:id/messages`, authMiddleware, this.conversationsController.getMessages)
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateConversationDto, 'body'), this.conversationsController.createConversation)
    this.router.delete(`${this.path}:/id`, authMiddleware, this.conversationsController.getConversations)
  }
}

export default ConversationRoute
