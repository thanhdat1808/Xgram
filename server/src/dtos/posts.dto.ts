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
  @IsString()
  posted_by: string
}
export class UpdatePostDto {
  @IsString()
  message: string
  @IsArray()
  medias: TMedia[]
}
export class AddComment {
  @IsString()
  id_post: string
  @IsString()
  comment: string
  @IsString()
  comment_by: string
}
export class EditComment {
  @IsString()
  comment: string
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
