import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'files'));
  app.useStaticAssets(join(__dirname, '../files/profile-images'));
  app.useStaticAssets(join(__dirname, '../files/product-images'));

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
