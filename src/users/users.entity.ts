import { Tasks } from 'src/tasks/tasks.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  // liaison entre users et tasks
  @OneToMany(() => Tasks, (task) => task.user)
  tasks: Tasks[];
}
