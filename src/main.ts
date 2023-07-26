import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MongoExceptionFilter } from './mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle('NestJS-Aerodyne')
  .setDescription('Mongo crud')
  .setVersion('1.0')
  .setBasePath('api')
  .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
