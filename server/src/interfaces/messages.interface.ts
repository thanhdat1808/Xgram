import { User } from './users.interface'

export interface MessageInterface {
  message_id: string
  message: string
  status: number
  type: 'text'|'image'|'sticker'|'video'
  sent_by: string
}
export interface MessageFormatInterface {
  _id: string
  message: string
  status: number
  type: 'text'|'image'|'sticker'|'video'
  sent_by: User
}
