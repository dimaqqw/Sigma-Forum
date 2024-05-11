import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTopicDto } from './dto/create-topic.dto'
import { UpdateTopicDto } from './dto/update-topic.dto'
import { Topic } from './entities/topic.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async create(createTopicDto: CreateTopicDto, id: number) {
    const isExist = await this.topicRepository.findOne({
      where: { title: createTopicDto.title },
    })

    if (isExist) throw new BadRequestException('This topic already exist')

    const newTopic = {
      title: createTopicDto.title,
      description: createTopicDto.description,
      user: { id },
    }

    return await this.topicRepository.save(newTopic)
  }

  async findAll() {
    return await this.topicRepository.find({
      relations: {
        user: true,
      },
    })
  }

  async findOne(id: number) {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    })

    if (!topic) throw new NotFoundException('Topic not found')
    return topic
  }

  async update(id: number, updateTopicDto: UpdateTopicDto, userId: number) {
    const topic = await this.topicRepository.findOne({ where: { id } })
    if (!topic) throw new NotFoundException('Topic not found')
    return await this.topicRepository.update(id, updateTopicDto)
  }

  async remove(id: number) {
    const topic = await this.topicRepository.findOne({ where: { id } })
    if (!topic) throw new NotFoundException('Topic not found')
    return await this.topicRepository.delete(id)
  }
}
