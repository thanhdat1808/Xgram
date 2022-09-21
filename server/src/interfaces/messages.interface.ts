export interface Message {
  _id: string
  story: string
  post: string
  react_type: number
  seen: boolean
  removed: boolean
  type: number
  created_at: Date
}
