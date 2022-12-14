import { model, Schema, Document } from 'mongoose'
import { TokenInterface } from '@/interfaces/token.interface'

const tokenSchema = new Schema({
  user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
  token: {
      type: String,
      required: true
  },
  created_at: {
      type: Date,
      default: Date.now,
      expires: 3600
  }
})

const tokenModel = model<TokenInterface & Document>('Token', tokenSchema)

export default tokenModel
