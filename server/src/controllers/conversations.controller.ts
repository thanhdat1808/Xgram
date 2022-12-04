import { RequestWithUser } from '@/interfaces/auth.interface'
import { ConversationFormatInterface } from '@/interfaces/conversations.interface'
import { MessageInterface } from '@/interfaces/messages.interface'
import ConversationService from '@/services/conversations.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { formatConversation, formatMessage } from '@/utils/formatData'
import { statusCode } from '@/utils/statuscode'
import { Response } from 'express'

class ConversationsController {
  public conversationService = new ConversationService()
  
  public getConversations = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const conversations: ConversationFormatInterface[] = await this.conversationService.getConversations(userId)
      resSuccess(res, conversations.map(conversation => formatConversation(conversation)), 'Get conversations')
    } catch (error) {
      resError(res, 'Fail to get', statusCode.INTERNAL_SERVER_ERROR)
    }
  }
  public getMessages = async (req: RequestWithUser, res: Response) => {
    try {
      const conversationId: string = req.params.id
      const conversations: ConversationFormatInterface = await this.conversationService.getMessage(conversationId)
      resSuccess(res, formatMessage(conversations.last_message), 'Get conversations')
    } catch (error) {
      resError(res, 'Fail to get', statusCode.INTERNAL_SERVER_ERROR)
    }
  }
  public createConversation = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id
      const message: MessageInterface = req.body
      const createConversation: ConversationFormatInterface = await this.conversationService.createConversation(userId, message)
      resSuccess(res, formatConversation(createConversation), 'Created')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }
  public deleteConversation = async (req: RequestWithUser, res: Response) => {
    try {
      const conversationId: string = req.params.id
      const deleteConversation: ConversationFormatInterface = await this.conversationService.deleteConversation(conversationId)
      resSuccess(res, formatConversation(deleteConversation), 'Deleted')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }
}

export default ConversationsController
