import { Module } from '@nestjs/common'
import { TopicService } from './topic.service'
import { TopicController } from './topic.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Topic } from './entities/topic.entity'
import { Post } from 'src/post/entities/post.entity'
import { PostService } from 'src/post/post.service'
import { Comment } from 'src/comment/entities/comment.entity'
import { CommentService } from 'src/comment/comment.service'
import { SocketService } from 'src/socket/socket.service'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Post, Comment, User])],
  controllers: [TopicController],
  providers: [TopicService, PostService, CommentService, SocketService],
})
export class TopicModule {}
