import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // .env dosyasını yükleme
  config();

  const app = await NestFactory.create(AppModule);

  // Swagger dokümantasyonu oluşturma
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('E-commerce uygulaması için API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth() // JWT desteği için
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); // Dokümantasyon URL'si: /api

  // Graceful shutdown işlemleri için dinleme
  process.on('SIGINT', async () => {
    console.log('Application is shutting down...');
    await app.close();
    process.exit(0);
  });

  // Port numarasını belirleme
  const port = process.env.PORT || 3000;
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger is available at: http://localhost:${port}/api`);

  await app.listen(port);
}
bootstrap();
