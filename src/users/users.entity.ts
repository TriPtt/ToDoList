import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Tasks } from 'src/tasks/tasks.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  //   @Column({ default: true })
  //   isActive: boolean;

  @Column()
  password: string;

  @ManyToMany((type) => Tasks, (task) => task.users)
  tasks: Tasks[];
}
