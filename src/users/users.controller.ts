import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  return(): string {
    return 'La route users fonctionne';
  }
}
