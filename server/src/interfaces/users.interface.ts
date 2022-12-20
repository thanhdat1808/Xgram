
export interface User {
  _id: string
  email: string
  password: string
  reset_password: string
  full_name: string
  user_name: string
  avatar_url: string
  cover_url: string
  phone_number: number
  date_of_birth: Date
  bio: string
  websites: []
  followers: []
  following: []
  gender: number
  created_at: Date
  updated_at: Date
}
export interface UserFormat {
  _id: string
  email: string
  password: string
  full_name: string
  user_name: string
  avatar_url: string
  cover_url: string
  phone_number: number
  date_of_birth: Date
  blocked_users: User[]
  bio: string
  websites: []
  followers: []
  following: []
  gender: number
  created_at: Date
  updated_at: Date
}
