import conversationsModel from '@/models/conversations.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { CustomError } from '@/utils/custom-error'
import { ConversationFormatInterface, ConversationInterface, CreateConversation } from '@/interfaces/conversations.interface'
import { CreateMessage, MessageFormatInterface, UpdateMessage } from '@/interfaces/messages.interface'
import messageModel from '@/models/message.model'

class ConversationService {
  public conversations = conversationsModel
  public messages = messageModel
  public populate = ['last_message', 'user']
  public populateMessage = [{
    path: 'post',
    populate: ['posted_by', 'comments', 'reactions']
  }, {
    path: 'story',
    populate: ['posted_by']
  }, {
    path: 'sent_by',
    populate: ['followers', 'following']
  }, {
    path: 'sent_to',
    populate: ['followers', 'following']
  }]

  public async getConversations(userId: string): Promise<ConversationInterface[]> {
    const findConversations: ConversationInterface[] = await this.conversations.find({ user: userId }).populate(this.populate)
    if(!findConversations) return []
    findConversations.map(conversation => {
      const user = conversation.user.filter(user => user._id.valueOf() !== userId)
      delete conversation.user
      conversation.user = user
    })
    return findConversations
  }
  public async createConversation(userId: string, dataConversation: CreateConversation): Promise<ConversationInterface> {
    if (isEmpty(dataConversation)) throw new CustomError('message id is empty', {}, statusCode.BAD_REQUEST)
    console.log(dataConversation)
    const checkExistConversation: ConversationInterface = await this.conversations.findOne({ user: dataConversation.user }).populate(this.populate)
    console.log(checkExistConversation)
    if(checkExistConversation) {
      const user = checkExistConversation.user.filter(user => user._id.valueOf() !== userId)
      delete checkExistConversation.user
      checkExistConversation.user = user
      return checkExistConversation
    } 
    const createConversation: ConversationInterface = await (await this.conversations.create(dataConversation)).populate(this.populate)
    console.log(createConversation)
    if(createConversation) {
      const user = createConversation.user.filter(user => user._id.valueOf() !== userId)
      delete createConversation.user
      createConversation.user = user
      return createConversation
    } 
  }

  public async updateConversation(conversationId: string, last_message: string): Promise<ConversationFormatInterface> {
    const updateConversation: ConversationFormatInterface = await this.conversations.findByIdAndUpdate(conversationId, { last_message, updated_at: Date.now() }, { new: true }).populate(this.populate)
    return updateConversation
  }

  public async deleteConversation(conversationId: string): Promise<ConversationInterface> {
    const deleteConversation: ConversationInterface = await this.conversations.findByIdAndDelete(conversationId).populate(this.populate)
    if(!deleteConversation) throw new CustomError('Conversation not exist', {}, statusCode.CONFLICT)
    return deleteConversation
  }

  public async getMessage(conversationId: string): Promise<MessageFormatInterface[]> {
    if (isEmpty(conversationId)) throw new CustomError('conversation id is empty', {}, statusCode.BAD_REQUEST)
    const findConversation: ConversationFormatInterface = await this.conversations.findById(conversationId)
    if (!findConversation) throw new CustomError('conversation is empty', {}, statusCode.CONFLICT)
    const getMessage: MessageFormatInterface[] = await this.messages.find({ conversation_id: conversationId }).sort({'created_at': -1}).populate(this.populateMessage)
    return getMessage
  }
  public async createMessage(dataMessage: CreateMessage): Promise<MessageFormatInterface> {
    if(isEmpty(dataMessage)) throw new CustomError('Message is empty', {}, 500)
    const createMessage: MessageFormatInterface = await (await this.messages.create({...dataMessage})).populate(this.populateMessage)
    return createMessage
  }

  public async updateMessage(messageId: string, dataMessage: UpdateMessage): Promise<MessageFormatInterface> {
    if(isEmpty(dataMessage)) throw new CustomError('Message is empty', {}, 500)
    const updateMessage: MessageFormatInterface = await this.messages.findByIdAndUpdate(messageId, {...dataMessage}, {new: true}).populate(this.populateMessage)
    if(isEmpty(updateMessage)) throw new CustomError('Message not exist', {}, statusCode.CONFLICT)
    return updateMessage
  }

  public async updateStatusMessage(messageId: string, status: number): Promise<MessageFormatInterface> {
    if(isEmpty(messageId)) throw new CustomError('Message id is empty', {}, 500)
    const updateMessage: MessageFormatInterface = await this.messages.findByIdAndUpdate(messageId, { status }, {new: true}).populate(this.populateMessage)
    if(isEmpty(updateMessage)) throw new CustomError('Message not exist', {}, statusCode.CONFLICT)
    return updateMessage
  }

  public async deleteMessage(messageId: string): Promise<void> {
    const deleteMessage = await this.messages.findByIdAndDelete(messageId)
    if(isEmpty(deleteMessage)) throw new CustomError('Message not exist', {}, statusCode.CONFLICT)
    return
  }
}

export default ConversationService
