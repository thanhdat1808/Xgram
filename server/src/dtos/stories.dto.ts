import { IsArray } from 'class-validator'
import { TMedia } from './posts.dto'

export class CreateStories {
  @IsArray()
  medias: TMedia[]
}
