import { IsString, IsArray } from 'class-validator'

export type TMedia = {
  media_id: string,
  url: string,
  is_video: boolean
}
export class CreatePostDto {
  @IsString()
  message: string
  @IsArray()
  medias: []
  @IsString()
  posted: string
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
  id_comment: string
  @IsString()
  comment: string
}
export class DeleteComment {
  @IsString()
  id_post: string
  @IsString()
  id_comment: string
}
