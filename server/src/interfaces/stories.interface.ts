import { TMedia } from '@/dtos/posts.dto'
import { User } from './users.interface'

export interface Story {
  _id: string
  medias: [{
    media_id: string,
    url: string,
    created_at: Date,
    isVideo: boolean
  }]
  posted_by: string
  created_at: string
  updated_at: Date
}
export interface StoryFormat {
  _id: string
  medias: TMedia[]
  posted_by: User
  created_at: string
  updated_at: Date
}
