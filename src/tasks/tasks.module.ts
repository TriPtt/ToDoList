import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Tasks } from './tasks.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: 'memory', // Vous pouvez changer le type de stockage en fonction de vos besoins
        ttl: 600, // Temps de vie du cache en secondes
      }),
    }),
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
