import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Incorect email' })
  email: string

  @MinLength(6, { message: 'Password must be more than 6 symbols.' })
  password: string

  @MinLength(3, { message: 'Username must be more than 6 symbols.' })
  username: string

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole
}
