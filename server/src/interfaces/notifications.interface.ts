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
