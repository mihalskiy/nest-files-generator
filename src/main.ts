import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors();
  app.use(json({ limit: '50mb'}))
  process.env.PORT
  await app.listen( process.env.PORT ?? 8080);
}
bootstrap();
