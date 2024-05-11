import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TopicService } from './topic.service'
import { CreateTopicDto } from './dto/create-topic.dto'
import { UpdateTopicDto } from './dto/update-topic.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthorGuard } from 'src/guard/author.guard'

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createTopicDto: CreateTopicDto, @Req() req) {
    return this.topicService.create(createTopicDto, +req.user.id)
  }

  @Get()
  findAll() {
    return this.topicService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(+id)
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
    @Req() req,
  ) {
    return this.topicService.update(+id, updateTopicDto, +req.user.id)
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Param('id') id: string) {
    return this.topicService.remove(+id)
  }
}
