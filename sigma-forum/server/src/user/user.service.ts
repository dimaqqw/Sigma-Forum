import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    })

    if (isExist) throw new BadRequestException('This email already exist')

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      username: createUserDto.username,
      role: createUserDto.role,
    })

    const token = this.jwtService.sign({
      email: createUserDto.email,
      role: createUserDto.role,
    })

    return { user, token }
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    })
  }
}
