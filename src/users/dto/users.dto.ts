import { IsInt, IsString } from 'class-validator';

export class UsersDto {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
