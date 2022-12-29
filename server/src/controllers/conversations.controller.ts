import { RequestWithUser } from '@/interfaces/auth.interface'
import { ConversationInterface, CreateConversation } from '@/interfaces/conversations.interface'
import { MessageFormatInterface } from '@/interfaces/messages.interface'
import ConversationService from '@/services/conversations.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { formatConversation, formatMessage } from '@/utils/formatData'
import { statusCode } from '@/utils/statuscode'
import { Response } from 'express'

class ConversationsController {
  public conversationService = new ConversationService()
  
  public getConversations = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const conversations: ConversationInterface[] = await this.conversationService.getConversations(userId)
      const data = conversations.length > 0 ? conversations.map(conversation => formatConversation(conversation)) : []
      resSuccess(res, data, 'Get conversations')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
  public createConversation = async (req: RequestWithUser, res: Response) => {
    try {
      const conversationData: CreateConversation = {
        user: [req.user._id.valueOf(), req.body.user_id]
      }
      const conversation: ConversationInterface = await this.conversationService.createConversation(req.user._id.valueOf() ,conversationData)
      resSuccess(res, formatConversation(conversation), 'Created')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
  public getMessages = async (req: RequestWithUser, res: Response) => {
    try {
      const conversationId: string = req.params.id
      const messages: MessageFormatInterface[] = await this.conversationService.getMessage(conversationId)
      resSuccess(res, messages.map(message => formatMessage(message)), 'Get messages')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
  public deleteConversation = async (req: RequestWithUser, res: Response) => {
    try {
      const conversationId: string = req.params.id
      const deleteConversation: ConversationInterface = await this.conversationService.deleteConversation(conversationId)
      resSuccess(res, formatConversation(deleteConversation), 'Deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default ConversationsController
