import { ConfigModule, ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtConstants = {
  secret:
    configService.get('JWT_SECRET_KEY') ||
    '689fbdc9b80633570f1bb1cd2c90ba71039891fc292bb81c685f3ac850b71bfb',
};
