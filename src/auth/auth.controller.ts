import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { Public } from 'src/app.decorator';
import { AuthDto } from './dto/auth.dto';

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

    const refreshToken = await this.authService.signIn(
      signInDto.email,
      signInDto.password
    );

    // Retournez l'access_token dans la réponse + refresh_token
    console.log('accessToken', accessToken.access_token);
    console.log('refreshToken', refreshToken.refresh_token);
    return {
      access_token: accessToken.access_token,
      refresh_token: refreshToken.refresh_token,
    };
  }

  @Public()
  @ApiOperation({
    summary: 'Régénerer un jwt grace au refresh token',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
  })
  @ApiBody({ type: AuthDto })
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    console.log('Received body:', Body); // Log le corps entier de la requête
    console.log('Received refreshToken:', refreshToken); // Debug
    return this.authService.refreshToken(refreshToken);
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
