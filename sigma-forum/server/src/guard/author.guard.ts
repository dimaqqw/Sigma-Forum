import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CommentService } from 'src/comment/comment.service'
import { PostService } from 'src/post/post.service'
import { TopicService } from 'src/topic/topic.service'

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly postService: PostService,
    private readonly topicService: TopicService,
    private readonly commentService: CommentService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { id, type } = request.params
    console.log(request.route.path)

    let entity

    switch (type) {
      case 'post':
        entity = await this.postService.findOne(+id)
        break
      case 'topic':
        entity = await this.topicService.findOne(+id)
        break
      case 'comment':
        entity = await this.commentService.findOne(+id)
        break
      default:
        throw new NotFoundException('[athor.guard]:Error')
    }

    const user = request.user
    console.log(user)

    if (user.role == 'admin') {
      return true
    }
    if (entity && user && entity.user.id === user.id) {
      return true
    }
    throw new BadRequestException('[author.guard]: Нет доступа к ресурсу')
  }
}
