import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

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
      expiresIn: '30s',
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

  async refreshToken(
    token: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    if (!token) {
      throw new BadRequestException('Refresh token doit être renseigné !');
    }

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
      expiresIn: '30s',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }
}
