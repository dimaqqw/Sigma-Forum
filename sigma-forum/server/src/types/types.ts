import { UserRole } from 'src/user/dto/create-user.dto'

export interface IUser {
  id: string
  email: string
  role: UserRole
}
