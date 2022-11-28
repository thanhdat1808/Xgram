import { model, Schema, Document } from 'mongoose'
import { Story } from '@/interfaces/stories.interface'

const storiesSchema: Schema = new Schema({
  medias: {
    type: [{
      url: {
        type: String
      },
      is_video: {
        type: Boolean
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    }]
  },
  posted_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

const storiesModel = model<Story & Document>('Stories', storiesSchema)

export default storiesModel
