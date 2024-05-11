import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { Post } from 'src/post/entities/post.entity'
import { PostService } from 'src/post/post.service'
import { TopicService } from 'src/topic/topic.service'
import { Topic } from 'src/topic/entities/topic.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, Topic])],
  controllers: [CommentController],
  providers: [CommentService, PostService, TopicService],
})
export class CommentModule {}
