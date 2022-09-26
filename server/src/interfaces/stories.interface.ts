
export interface Story {
  _id: string
  medias: [{
    media_id: string,
    url: string,
    created_at: Date,
    isVideo: boolean,
    rotation: number,
    scale: number
  }]
  posted_by: string
  created_at: string
  updated_at: Date
}
