import { Post } from 'src/post/entities/post.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn({ name: 'topic_id' })
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @OneToMany(() => Post, (post) => post.topic, { onDelete: 'CASCADE' })
  posts: Post[]

  @ManyToOne(() => User, (user) => user.id)
  user: User
}
