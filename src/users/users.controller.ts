import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { Users } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async newUser(@Body() usersDto: UsersDto): Promise<Users> {
    return this.usersService.newUser(usersDto);
  }

  @Get()
  async findUserByEmail(@Query('email') email: string): Promise<Users> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
