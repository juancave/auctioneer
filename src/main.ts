import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.PREFIX);
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(config.PORT);
}
bootstrap();
