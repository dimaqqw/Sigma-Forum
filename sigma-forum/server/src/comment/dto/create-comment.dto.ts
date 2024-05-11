import { IsNotEmpty, IsOptional } from 'class-validator'
import { Post } from 'src/post/entities/post.entity'

export class CreateCommentDto {
  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  post: Post

  @IsOptional()
  parent?: number
}
