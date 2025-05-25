import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  // TODO: Optionally you can add a global prefix
  /*
  app.setGlobalPrefix('api');
  */
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  await app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
}
bootstrap();
