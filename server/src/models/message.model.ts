import { model, Schema, Document } from 'mongoose'
import { MessageInterface } from '@/interfaces/messages.interface'

const messageSchema: Schema = new Schema({
  conversation_id: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: Number,
    max: 3,
    min: 0,
    default: 0
  },
  type: {
    type: String,
    enum: ['text', 'sticker', 'image', 'video', 'post', 'story']
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  story: {
    type: Schema.Types.ObjectId,
    ref: 'Stories'
  },
  sent_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const messageModel = model<MessageInterface & Document>('Message', messageSchema)

export default messageModel
