import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  prismaService.enableShutdownHooks(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // only accept the data what is permitted in dtos
      forbidNonWhitelisted: true, // throws error when there is data that is not in dto
      transform: true, // transform req in the dto object
    }),
  );

  await app.listen(3000);
}
bootstrap();
