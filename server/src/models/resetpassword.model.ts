import { model, Schema, Document } from 'mongoose'
import { ResetPasswordInterface } from '@/interfaces/token.interface'

const resetPasswordSchema = new Schema({
  user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
  password: {
      type: String,
      required: true
  },
  created_at: {
      type: Date,
      default: Date.now,
      expires: 3600
  }
})

const resetPasswordModel = model<ResetPasswordInterface & Document>('ResetPassword', resetPasswordSchema)

export default resetPasswordModel
