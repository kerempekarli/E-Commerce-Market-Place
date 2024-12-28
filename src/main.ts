import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';

// console.log('DB_PASS:', process.env.DB_PASS); // Değeri kontrol edin
async function bootstrap() {
  dotenv.config(); // Çevresel değişkenleri yükler
  config();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
