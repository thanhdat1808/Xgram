import { PostFormat } from './posts.interface'
import { StoryFormat } from './stories.interface'
import { User } from './users.interface'

export interface MessageInterface {
  message_id: string
  conversation_id: string
  message: string
  status: number
  type: 'text'|'image'|'sticker'|'video'
  sent_by: string
}
export interface MessageFormatInterface {
  _id: string
  conversation_id: string
  message: string | null
  status: number
  type: 'text'|'image'|'sticker'|'video'|'post'|'story'
  post: PostFormat | null
  story: StoryFormat | null
  sent_by: User
  sent_to: User
}
export interface CreateMessage {
  conversation_id: string
  message: string
  status: number
  type: string
  post: string | null
  story: string | null
  sent_by: string
  sent_to: string
}
export interface UpdateMessage {
  message: string
}
export interface SendMessage {
  conversation_id: string
  message: string
  type: string
  sent_by: string
  sent_to: string
}
