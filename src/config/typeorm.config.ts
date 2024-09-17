import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  password: process.env.PG_PASSWORD,
  username: process.env.PG_USERNAME,
  entities: [User],
  database: process.env.PG_DB,
  synchronize: true,
  logging: true,
};
