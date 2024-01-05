import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
<<<<<<< HEAD
  date: string;
=======
  date: Date;
>>>>>>> 4a54f9467c0e9a8517e140451afaec845ffa06e9
}
