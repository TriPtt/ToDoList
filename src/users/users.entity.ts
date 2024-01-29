import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Tasks, (task) => task.user)
  tasks: Tasks[];
}
