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
  date: string;
<<<<<<< HEAD
=======

  @Column()
  idUser: number;
>>>>>>> 79e216c83d8356b6f79c81536e8c780e172311ff
}
