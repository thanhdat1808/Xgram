import { model, Schema, Document } from 'mongoose'
import { MessageInterface } from '@/interfaces/messages.interface'

const conversationsSchema: Schema = new Schema({
  last_message: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

const conversationsModel = model<MessageInterface & Document>('Conversation', conversationsSchema)

export default conversationsModel
