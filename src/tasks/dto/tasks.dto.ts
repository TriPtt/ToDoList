import { IsInt, IsString } from 'class-validator';

export class TasksDto {
  @IsInt()
  readonly id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  date: string;

  @IsInt()
  idUser: number;
}
