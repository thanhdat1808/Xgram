import { MessageFormatInterface } from './messages.interface'
import { User } from './users.interface'

export interface ConversationInterface {
  _id: string
  last_message: MessageFormatInterface
  users: User[]
  created_at: Date
  updated_at: Date
}
export interface ConversationFormatInterface {
  _id: string
  last_message: MessageFormatInterface
  user: User
  created_at: Date
  updated_at: Date
}
export interface CreateConversation {
  users: string[]
}
