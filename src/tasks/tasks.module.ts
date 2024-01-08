import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Tasks } from './tasks.entity';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, Users])],
  controllers: [TasksController],
  providers: [TasksService], // Include UsersRepository here
})
export class TasksModule {}
