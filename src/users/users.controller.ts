import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { Users } from './users.entity';
import { UpdateUserDto } from './dto/update.users.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':email/tasks')
  async getUserTasks(@Param('email') email: string): Promise<Users> {
    const user = await this.usersService.findUserAndTasksByEmail(email, [
      'tasks',
    ]);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Get(':email')
  async findUserByEmail(@Query('email') email: string): Promise<Users> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Post('')
  async newUser(@Body() usersDto: UsersDto): Promise<Users> {
    return this.usersService.newUser(usersDto);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('email') email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    await this.usersService.deleteUser(email);
  }

  @Patch(':email')
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Users> {
    return this.usersService.updateUser(email, updateUserDto);
  }
}
