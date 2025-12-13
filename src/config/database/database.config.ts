import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './database-config.types';
import path from 'path';

export function getConfig(): DatabaseConfig {
  return {
    type: 'postgres',
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      path.join(__dirname, '..', '..', 'modules/**/entities/*.entity{.ts,.js}'),
    ],
    migrations: [path.join(__dirname, '..', '..', 'migrations/**/*{.ts,.js}')],
    logging: process.env.NODE_ENV !== 'production',
  };
}

export default registerAs('database', () => {
  return getConfig();
});
