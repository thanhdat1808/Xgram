import { CommentFormat, PostFormat } from './posts.interface'
import { UserFormat } from './users.interface'

export interface Notification {
  _id: string
  type: string
  ref_post: PostFormat
  ref_user: UserFormat
  ref_comment: CommentFormat
  user: string
  post_id: string
  created_at: Date
}
export interface CreateNotification {
  type: string
  ref_post: string | null
  ref_user: string | null
  ref_comment: string | null
  user: string
  to_user: string
  post_id: string | null
}
