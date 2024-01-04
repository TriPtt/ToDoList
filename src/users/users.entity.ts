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
}
