import { IsEmail, IsString, IsNumber, IsArray } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  full_name: string

  @IsString()
  avatar_url: string

  @IsString()
  bio: string

  @IsNumber()
  gender: number
}
export class UpdateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  full_name: string

  @IsString()
  avatar_url: string

  @IsString()
  bio: string

  @IsNumber()
  gender: number
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
  @IsEmail()
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
