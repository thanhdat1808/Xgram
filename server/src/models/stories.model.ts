import { model, Schema, Document } from 'mongoose'
import { Story } from '@/interfaces/stories.interface'

const storySchema: Schema = new Schema({
  medias: {
    type: [{
      url: {
        type: String
      },
      isVideo: {
        type: Boolean
      },
      rotation: {
        type: Number
      },
      scale: {
        type: Number
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

const storyModel = model<Story & Document>('Stories', storySchema)

export default storyModel
