import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  console.log('I AM LISTENING ON PORT AUTH"S ', process.env.PORT);
  console.log('I AM LISTENING ON PORT AUTH"S ', process.env.PORT);

  
}
 bootstrap();
