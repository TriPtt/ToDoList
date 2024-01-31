import { ConfigModule, ConfigService } from '@nestjs/config';

const configService = new ConfigService();

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

export const jwtConstants = {
  secret: configService.get('JWT_SECRET_KEY'),
  refreshSecret: configService.get('REFRESH_SECRET_KEY'),
  inject: [ConfigService],
};
