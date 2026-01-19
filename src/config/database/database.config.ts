import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '../env';

export function getConfig(): TypeOrmModuleOptions {
  if (env.NODE_ENV === 'production') {
    return {
      type: 'postgres',
      url: env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    };
  }

  return {
    type: 'postgres',
    host: env.DB_HOSTNAME,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    autoLoadEntities: true,
    synchronize: false,
  };
}

export default registerAs('database', getConfig);