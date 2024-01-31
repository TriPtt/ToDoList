import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  //   @ApiProperty()
  //   @IsInt()
  //   readonly id: number;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}
