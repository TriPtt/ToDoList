import { Module } from '@nestjs/common';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TasksModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksHttpModule {}
