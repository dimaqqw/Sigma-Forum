import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { Topic } from 'src/topic/entities/topic.entity'
import { TopicService } from 'src/topic/topic.service'
import { CommentService } from 'src/comment/comment.service'
import { Comment } from 'src/comment/entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Topic, Comment])],
  controllers: [PostController],
  providers: [PostService, TopicService, CommentService],
})
export class PostModule {}
