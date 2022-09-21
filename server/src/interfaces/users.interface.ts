
export interface User {
  _id: string
  email: string
  password: string
  full_name: string
  avatar_url: string
  bio: string
  followers: []
  following: []
  gender: number
  created_at: Date
  updated_at: Date
}
