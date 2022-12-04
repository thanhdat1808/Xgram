import { model, Schema, Document } from 'mongoose'
import { MessageInterface } from '@/interfaces/messages.interface'

const messageSchema: Schema = new Schema({
  message: {
    type: String
  },
  status: {
    type: Number,
    max: 3,
    min: 0
  },
  type: {
    type: String,
    enum: ['text', 'sticker', 'image', 'video']
  },
  sent_by: {
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
