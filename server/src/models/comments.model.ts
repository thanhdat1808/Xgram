import { CommentFormat } from '@/interfaces/posts.interface'
import { model, Schema, Document } from 'mongoose'

const commentSchema: Schema = new Schema({
  comment: {
    type: String
  },
  commented_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
const commentModel = model<CommentFormat & Document>('Comment', commentSchema)

export default commentModel
