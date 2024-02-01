import { IsArray, IsDate, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TasksDto {
  @ApiProperty()
  @IsInt()
  readonly id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty({ type: [Number] }) // Specify that the type is an array of numbers
  @IsArray()
  readonly users: number[];
}
