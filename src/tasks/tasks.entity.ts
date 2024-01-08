import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/users.entity';

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  date: string;

  // liaison entre users et tasks
  @ManyToOne(() => Users, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
