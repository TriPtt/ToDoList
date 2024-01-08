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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { Users } from './users.entity';
import { UpdateUserDto } from './dto/update.users.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findUserByEmail(@Query('email') email: string): Promise<Users> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} n'a pas été trouvé`
      );
    }
    return user;
  }

  @Post('/new')
  async newUser(@Body() usersDto: UsersDto): Promise<Users> {
    if (!usersDto.email || !usersDto.password) {
      throw new BadRequestException(
        "Le mot de passe et/ou l'email sont/est manquant"
      );
    }
    return this.usersService.newUser(usersDto);
  }

  @Delete(':email/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('email') email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} n'a pas été trouvé`
      );
    }
    await this.usersService.deleteUser(email);
  }

  @Patch(':email/update')
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Users> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} n'a pas été trouvé`
      );
    }
    return this.usersService.updateUser(email, updateUserDto);
  }
}
