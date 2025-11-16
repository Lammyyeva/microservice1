import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('HELLO TYPE', process.env.DB_TYPE);
console.log('HELLO ', process.env.DB_HOST);

console.log('HELLO', process.env.DB_PORT);
console.log('HELLO', process.env.DB_USER);
console.log('HELLO', process.env.DB_PASS);


export const databaseConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  autoLoadEntities: true,
  entities: [],
};
