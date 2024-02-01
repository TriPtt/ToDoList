import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Tasks } from './tasks.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Users } from '../users/users.entity';
import { TasksRepository } from './tasks.repository';
import { UsersRepository } from '../users/users.repository';
@Module({
  imports: [TypeOrmModule.forFeature([Tasks, Users])],
  controllers: [TasksController],
  providers: [TasksService, UsersRepository], // Include UsersRepository here
})
export class TasksModule {}
