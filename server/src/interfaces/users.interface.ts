
export interface User {
  _id: string
  email: string
  password: string
  full_name: string
  avatar_url: string
  cover_url: string
  bio: string
  websites: []
  followers: []
  following: []
  gender: number
  created_at: Date
  updated_at: Date
}
