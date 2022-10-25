import { IsEmail, IsString, IsNumber, IsArray } from 'class-validator'

export class CreatePostDto {
  @IsString()
  message: string
  @IsArray()
  medias: []
  @IsString()
  posted: string
}
