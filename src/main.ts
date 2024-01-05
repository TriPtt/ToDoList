import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ToDoList API')
    .setDescription('API for ToDoList')
    .setVersion('0.0')
    .addBearerAuth() // Ajoutez cette ligne pour activer l'authentification Bearer
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3000);
  console.log(process.env.API_PORT);
  console.log(process.env.DATABASE_USER);
}

bootstrap();
