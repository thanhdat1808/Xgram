import { model, Schema, Document } from 'mongoose'
import { Message } from '@/interfaces/messages.interface'

const conversationsSchema: Schema = new Schema({
  last_message: {
    type: Schema.Types.ObjectId,
    ref: 'Messages'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

const conversationsModel = model<Message & Document>('Conversation', conversationsSchema)

export default conversationsModel
