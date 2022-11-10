import { model, Schema, Document } from 'mongoose'
import { Notification } from '@/interfaces/notifications.interface'

const notifSchema: Schema = new Schema({
  type: {
    type: Number,
    min: 0,
    max: 3
  },
  post: {
    type: String
  },
  comment: {
    type: String
  },
  story: {
    type: String
  },
  user_id: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const notifModel = model<Notification & Document>('Notification', notifSchema)

export default notifModel
