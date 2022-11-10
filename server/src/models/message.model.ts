import { model, Schema, Document } from 'mongoose'
import { Message } from '@/interfaces/messages.interface'

const messageSchema: Schema = new Schema({
  story: {
    type: String
  },
  post: {
    type: String
  },
  react_type: {
    type: Number
  },
  seen: {
    type: Boolean
  },
  remove: {
    type: Boolean
  },
  type: {
    type: Number,
    min: 0,
    max: 3
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const messageModel = model<Message & Document>('Post', messageSchema)

export default messageModel
