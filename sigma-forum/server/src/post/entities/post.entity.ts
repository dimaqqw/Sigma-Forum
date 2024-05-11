import { Topic } from 'src/topic/entities/topic.entity'
import { User } from 'src/user/entities/user.entity'
import { Comment } from 'src/comment/entities/comment.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @ManyToOne(() => Topic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
