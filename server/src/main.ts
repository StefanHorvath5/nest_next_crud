import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS here
  app.enableCors({
    origin: `http://localhost:${process.env.PORT ?? 3000}`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
