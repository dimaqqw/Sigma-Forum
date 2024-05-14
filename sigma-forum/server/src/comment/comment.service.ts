import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, post, parent } = createCommentDto
    let parentComment
    if (parent) {
      parentComment = parent
        ? await this.commentRepository.findOne({
            where: {
              comment_id: parent,
            },
            relations: {
              user: true,
              post: true,
            },
          })
        : null

      if (!parentComment) {
        throw new NotFoundException(
          '[comment.service]: Parent comment not found',
        )
      }
    }
    const { username } = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    })

    const newComment = {
      content: content,
      parent: parentComment,
      post: post,
      user: { id: userId, username: username },
    }
    if (!newComment)
      throw new BadRequestException('[comment.service]: Cant create comment')
    console.log(await this.commentRepository.save(newComment))

    return await this.commentRepository.save(newComment)
  }

  async findAllByPost(postId: number) {
    const comments = await this.commentRepository.find({
      where: {
        post: { id: postId },
      },
      relations: {
        user: true,
        post: true,
        parent: true,
      },
    })
    return comments
  }

  async findOne(id: number) {
    const isExists = await this.commentRepository.findOne({
      where: {
        comment_id: id,
      },
      relations: {
        user: true,
        post: true,
      },
    })
    if (!isExists)
      throw new NotFoundException('[comment.service]: Comment not found')
    return isExists
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const isExists = await this.commentRepository.findOne({
      where: {
        comment_id: id,
      },
    })
    if (!isExists)
      throw new NotFoundException('[comment.service]: Comment not found')
    isExists.content = updateCommentDto.content
    return await this.commentRepository.save(isExists)
  }

  async remove(id: number) {
    const isExists = await this.commentRepository.findOne({
      where: {
        comment_id: id,
      },
    })
    if (!isExists)
      throw new NotFoundException('[comment.service]: Comment not found')
    return await this.commentRepository.delete(id)
  }
}
