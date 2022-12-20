import { IsArray } from 'class-validator'

export class CreateStories {
  @IsArray()
  medias: []
}
