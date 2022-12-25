import { model, Schema, Document } from 'mongoose'
import { Notification } from '@/interfaces/notifications.interface'

const notificationsSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['react', 'follow', 'comment', 'mention'],
    require: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  to_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ref_post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  ref_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ref_comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  post_id: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const notificationModel = model<Notification & Document>('Notification', notificationsSchema)

export default notificationModel
