import { Module } from '@nestjs/common'
import { TopicService } from './topic.service'
import { TopicController } from './topic.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Topic } from './entities/topic.entity'
import { Post } from 'src/post/entities/post.entity'
import { PostService } from 'src/post/post.service'
import { Comment } from 'src/comment/entities/comment.entity'
import { CommentService } from 'src/comment/comment.service'

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Post, Comment])],
  controllers: [TopicController],
  providers: [TopicService, PostService, CommentService],
})
export class TopicModule {}
