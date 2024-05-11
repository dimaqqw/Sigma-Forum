import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IUser } from 'src/types/types'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (!user) {
      throw new UnauthorizedException('Email or password are incorrect')
    }

    const passwordIsMatch = await bcrypt.compare(pass, user.password)

    if (passwordIsMatch) {
      return user
    }
    throw new UnauthorizedException('Password are incorrect')
  }

  async login(user: IUser) {
    const { id, email } = user
    return {
      id,
      email,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    }
  }
}
