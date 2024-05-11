import { IsNotEmpty } from 'class-validator'
import { Topic } from 'src/topic/entities/topic.entity'

export class CreatePostDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  topic: Topic
}
