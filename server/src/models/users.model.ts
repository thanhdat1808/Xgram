import { model, Schema, Document } from 'mongoose'
import { User } from '@interfaces/users.interface'

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    require: true
  },
  user_name: {
    type: String,
    unique: true,
    require: true
  },
  avatar_url: {
    type: String
  },
  cover_url: {
    type: String
  },
  bio: {
    type: String
  },
  phone_number: {
    type: String
  },
  date_of_birth: {
    type: String
  },
  followers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  following: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  gender: {
    type: Number,
    require: true,
    min: 0,
    max: 1
  },
  websites: {
    type: []
  },
  blocked_users: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
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

const userModel = model<User & Document>('User', userSchema)

export default userModel
