export interface TokenInterface {
  _id: string
  user_id: string
  token: string
  created_at: Date
}
export interface ResetPasswordInterface {
  _id: string
  user_id: string
  password: string
  created_at: Date
}
