import { IsEmail, IsString, IsNumber, IsArray, IsDate } from 'class-validator'

export class CreateUserDto {
  @IsString()
  user_name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  full_name: string

  @IsNumber()
  gender: number

  @IsString()
  date_of_birth: string
}
export class UpdateUserDto {
  @IsEmail()
  email: string

  @IsString()
  full_name: string

  @IsString()
  avatar_url: string

  @IsString()
  cover_url: string

  @IsString()
  bio: string

  @IsNumber()
  gender: number

  @IsNumber()
  phone_number: number

  @IsDate()
  date_of_birth: Date
}
export class SetFollowerUserDto {
  @IsArray()
  followers: string[]
}
export class SetFollowingUserDto {
  @IsArray()
  following: string[]
}
export class LoginUser {
  @IsString()
  email: string
  @IsString()
  password: string
}
export class FollowUser {
  @IsString()
  id_user: string
  @IsString()
  id_follow: string
}
export class PasswordDto {
  @IsString()
  old_password: string
  @IsString()
  new_password: string
}
export class ForgotPassword {
  @IsEmail()
  email: string
}
