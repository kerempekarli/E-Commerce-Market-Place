import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { config } from 'dotenv';

// .env dosyasını yükleyin
config();

console.log('DB USER:', process.env.DB_USER); // Değişkenleri kontrol edin
console.log('DB USER:', process.env.DB_PASS); // Değişkenleri kontrol edin
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'mysecretpass',
  database: process.env.DB_NAME || 'ecommerce_db',
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
};
