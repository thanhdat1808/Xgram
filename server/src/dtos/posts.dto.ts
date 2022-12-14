import { IsString, IsArray, IsNumber } from 'class-validator'

export type TMedia = {
  _id: string,
  url: string,
  is_video: boolean,
  created_at: Date
}
export class CreatePostDto {
  @IsString()
  message: string
  @IsArray()
  medias: TMedia[]
}
export class UpdatePostDto {
  @IsString()
  message: string
  @IsArray()
  medias: TMedia[]
}
export class AddComment {
  @IsString()
  data: string
}
export class EditComment {
  @IsString()
  data: string
}
export class DeleteComment {
  @IsString()
  id_post: string
  @IsString()
  id_comment: string
}
export class Reaction {
  @IsString()
  id_post: string
  @IsNumber()
  type: number
  @IsString()
  reacted_by: string
}
export class UnReaction {
  @IsString()
  id_post: string
  @IsString()
  reacted_by: string
}
