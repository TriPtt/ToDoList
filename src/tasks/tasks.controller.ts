import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  return(): string {
    return 'La route tasks fonctionne bien';
  }
}
