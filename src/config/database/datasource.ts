// src/config/database/datasource.ts
import { DataSource } from 'typeorm';
import { env } from '../env';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOSTNAME,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: false,
  // logging: process.env.NODE_ENV !== 'production',
});

// Export as default for TypeORM CLI
export default AppDataSource;
