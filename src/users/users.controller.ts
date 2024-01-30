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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/app.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Récupérer un user par son email',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({ status: 200, description: 'User récupéré avec succès' })
  @ApiBearerAuth()
  @Get(':email')
  async findUserByEmail(@Query('email') email: string): Promise<Users> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} n'a pas été trouvé`
      );
    }
    return user;
  }

  @ApiOperation({
    summary: 'Ajouter un nouvel utilisateur',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User créé avec succès' })
  @ApiBody({ type: UsersDto })
  @Public()
  @Post('')
  async newUser(@Body() usersDto: UsersDto): Promise<Users> {
    if (!usersDto.email || !usersDto.password) {
      throw new BadRequestException(
        "Le mot de passe et/ou l'email sont/est manquant"
      );
    }
    return this.usersService.newUser(usersDto);
  }

  @ApiOperation({
    summary: 'Supprimer un user par son email',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({ status: 204, description: 'User supprimé avec succès' })
  @ApiBearerAuth()
  @Delete(':email')
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

  @ApiOperation({
    summary: 'Mettre à jour un user par son email',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({ status: 200, description: 'User mis à jour avec succès' })
  @ApiBearerAuth()
  @Patch(':email')
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
