import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  userId: number;

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users;

  @ManyToMany((type) => Users, (user) => user.tasks)
  @JoinTable()
  users: Users[];
}
