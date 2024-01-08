import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from 'src/users/users.entity'; // Importer l'entité des utilisateurs

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

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users;
}
