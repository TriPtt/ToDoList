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
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/app.decorator';
import { log } from 'console';

class SignInDto {
  @ApiProperty({ type: String, description: 'Adresse email' })
  email: string;

  @ApiProperty({ type: String, description: 'Mot de passe' })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login' })
  @ApiOperation({ summary: 'Se connecter' })
  @ApiBody({ type: SignInDto })
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('You must provide an email AND a password');
    }

    // Appel de la méthode signIn du service AuthService pour obtenir l'access_token
    const accessToken = await this.authService.signIn(
      signInDto.email,
      signInDto.password
    );

    // Retournez l'access_token dans la réponse
    console.log('accessToken', accessToken.access_token);
    return { access_token: accessToken.access_token };
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
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
