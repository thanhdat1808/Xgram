import userModel from '@/models/users.model'
import conversationsModel from '@/models/conversations.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { CustomError } from '@/utils/custom-error'
import { ConversationFormatInterface } from '@/interfaces/conversations.interface'
import { MessageInterface } from '@/interfaces/messages.interface'

class ConversationService {
  public conversations = conversationsModel
  public users = userModel
  public populate = ['last_message', 'user']

  public async getConversations(userId: string): Promise<ConversationFormatInterface[]> {
    const findConversation: ConversationFormatInterface[] = await this.conversations.find({ user: userId }).populate(this.populate)
    return findConversation
  }
  public async getMessage(conversationId: string): Promise<ConversationFormatInterface> {
    if (isEmpty(conversationId)) throw new CustomError('conversation id is empty', {}, statusCode.BAD_REQUEST)
    const findConversation: ConversationFormatInterface = await this.conversations.findById(conversationId)
    if (!findConversation) throw new CustomError('conversation is empty', {}, statusCode.CONFLICT)
    return findConversation
  }
  public async createConversation(userId: string, message: MessageInterface): Promise<ConversationFormatInterface> {
    if (isEmpty(message)) throw new CustomError('message id is empty', {}, statusCode.BAD_REQUEST)
    const createConversation: ConversationFormatInterface = await (await this.conversations.create({user: userId, last_message: message})).populate(this.populate)
    return createConversation
  }
  public async deleteConversation(conversationId: string): Promise<ConversationFormatInterface> {
    const deleteConversation: ConversationFormatInterface = await this.conversations.findByIdAndDelete(conversationId)
    if(!deleteConversation) throw new CustomError('Conversation not exist', {}, statusCode.CONFLICT)
    return deleteConversation
  }
}

export default ConversationService
