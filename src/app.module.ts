import { Tasks } from './tasks/tasks.entity';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Users } from './users/users.entity';
import { AuthModule } from './auth/auth.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { MetricsMiddleware } from './middlewares/metrics.middleware';
import { MetricsService } from './middlewares/metrics.service';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // en millisecondes !!!!
          limit: 20,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        // CacheModule.register({
        //   isGlobal: true,
        //   useFactory: () => ({
        //     store: 'memory', // Vous pouvez changer le type de stockage en fonction de vos besoins
        //     ttl: 600, // Temps de vie du cache en secondes
        //   }),
        // }),
      ],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT') || 5432,
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Tasks, Users],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CacheModule.register({ ttl: 10000, isGlobal: true }),
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },

    // mettre en commentaire pour le dev 👇👇👇
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
