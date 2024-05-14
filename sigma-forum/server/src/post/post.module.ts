import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { Topic } from 'src/topic/entities/topic.entity'
import { TopicService } from 'src/topic/topic.service'
import { CommentService } from 'src/comment/comment.service'
import { Comment } from 'src/comment/entities/comment.entity'
import { SocketService } from 'src/socket/socket.service'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Topic, Comment, User])],
  controllers: [PostController],
  providers: [PostService, TopicService, CommentService, SocketService],
})
export class PostModule {}
