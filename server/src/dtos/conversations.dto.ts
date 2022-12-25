import { IsString } from 'class-validator'

export class CreateConversationDto {
  @IsString()
  user_id: string
}
