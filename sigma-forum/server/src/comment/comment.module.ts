import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { Post } from 'src/post/entities/post.entity'
import { PostService } from 'src/post/post.service'
import { TopicService } from 'src/topic/topic.service'
import { Topic } from 'src/topic/entities/topic.entity'
import { SocketService } from 'src/socket/socket.service'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, Topic, User])],
  controllers: [CommentController],
  providers: [CommentService, PostService, TopicService, SocketService],
})
export class CommentModule {}
