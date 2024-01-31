import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  async refreshToken(token: string): Promise<{ access_token: string }> {
    if (!token) {
      throw new BadRequestException('Refresh token doit être renseigné !');
    }

    try {
      const data = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });
      if (!data) {
        throw new NotFoundException('Aucun token fourni');
      }

      const user = await this.usersService.findUserByEmail(data.username);
      if (!user) {
        throw new NotFoundException('Utilisateur pas trouvé');
      }

      const payload = {
        sub: user.id,
        username: user.email,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '15m',
      });

      return { access_token };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Le refresh token est expiré, reconnectez vous !!!'
        );
      } else {
        throw new UnauthorizedException(
          'Erreur de traitement du refresh token'
        );
      }
    }
  }

  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  async generate(token: string): Promise<{ api_key: string }> {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    let data;
    try {
      data = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }

    const user = await this.usersService.findUserByEmail(data.username);
    if (!user) {
      throw new NotFoundException('Utilisateur pas trouvé');
    }

    const payload = {
      sub: user.id,
      username: user.email,
    };

    const api_key = this.jwtService.sign(payload, {
      // Bon on créé un token jwt plutôt qu'une vrai clé API parce que pas le temps
      secret: jwtConstants.secret,
      expiresIn: '365d',
    });

    console.log('API_KEY générée:' + api_key);

    return { api_key };
  }
}
