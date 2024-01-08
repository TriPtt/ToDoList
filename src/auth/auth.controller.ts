import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/app.decorator';
import { log } from 'console';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: Object }) // Spécifie le type du corps de la requête dans Swagger
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login' })
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('You must provide an email AND a password');
    }
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth() // Ajoutez cette ligne
  // @Get('profile')
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'No user found for those credentials',
  // })
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
