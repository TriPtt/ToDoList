import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressPromBundle from 'express-prom-bundle';
const metricsMiddleware = expressPromBundle({ includeMethod: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(metricsMiddleware);

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('ToDoList API')
    .setDescription('API for ToDoList')
    .setVersion('0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customCss: '.curl-code {display: none;}', // Optionnel : pour masquer l'ancien code curl
    // customJs: customScript, // Ajout du script personnalisé
  });

  await app.listen(4000);
  console.log(process.env.API_PORT);
  console.log(process.env.DATABASE_USER);
}

bootstrap();
