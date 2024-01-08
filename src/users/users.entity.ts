import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tasks } from 'src/tasks/tasks.entity'; // Importer l'entité des tâches

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Tasks, (task) => task.user)
  tasks: Tasks[];
}
