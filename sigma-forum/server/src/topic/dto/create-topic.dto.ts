import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateTopicDto {
  @IsNotEmpty({ message: 'This reqired field' })
  title: string

  @IsOptional()
  description?: string
}
