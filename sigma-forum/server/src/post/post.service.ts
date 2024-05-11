import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { In, Like, Repository } from 'typeorm'
import { Topic } from 'src/topic/entities/topic.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const topicExists = await this.topicRepository.findOne({
      where: { id: +createPostDto.topic },
    })
    if (!topicExists)
      throw new BadRequestException('[post.service]: No such topic')
    const newPost = {
      title: createPostDto.title,
      content: createPostDto.content,
      topic: { id: +createPostDto.topic },
      user: { id: userId },
    }
    if (!newPost)
      throw new BadRequestException('[post.service]: Cant create post')

    return await this.postRepository.save(newPost)
  }

  //TODO
  async findAll() {
    const posts = await this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'topic', 'comments', 'comments.user'],
      loadEagerRelations: true,
      select: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
    })

    const filteredPosts = posts.map((post) => ({
      ...post,
      comments: post.comments.map((comment) => ({
        ...comment,
        user: comment.user
          ? { id: comment.user.id, username: comment.user.username }
          : null,
      })),
    }))

    return filteredPosts
  }

  async findAllByUser(id: number) {
    const posts = await this.postRepository.find({
      where: {
        user: { id },
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return posts
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: true,
        topic: true,
        comments: true,
      },
    })
    if (!post) throw new BadRequestException('[post.service]: Cant find post')
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const topicExists = await this.topicRepository.findOne({
      where: { id: +updatePostDto.topic },
    })
    if (!topicExists)
      throw new BadRequestException('[post.service]: No such topic')
    const post = await this.postRepository.findOne({
      where: { id },
    })
    if (!post) throw new BadRequestException('[post.service]: Cant find post')
    return await this.postRepository.update(id, updatePostDto)
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    })
    if (!post) throw new BadRequestException('[post.service]: Cant find post')
    return await this.postRepository.delete(id)
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const post = await this.postRepository.find({
      where: {
        user: { id },
      },
      relations: {
        topic: true,
        user: true,
        comments: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return post
  }

  async findByTitle(title: string) {
    const posts = await this.postRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
      relations: {
        user: true,
        topic: true,
        comments: true,
      },
    })
    return posts
  }

  async findByTopics(topicIds: number[]) {
    const posts = await this.postRepository.find({
      where: {
        topic: {
          id: In(topicIds),
        },
      },
      relations: {
        user: true,
        topic: true,
        comments: true,
      },
    })
    return posts
  }
}
