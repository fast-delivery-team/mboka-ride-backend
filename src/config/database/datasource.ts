import { DataSource } from 'typeorm';
import { env } from '../env';

const isProd = env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'postgres',

  ...(isProd
    ? {
        url: env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
      }
    : {
        host: env.DB_HOSTNAME,
        port: Number(env.DB_PORT),
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        autoLoadEntities: true
      }),

  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: false,
  // logging: !isProd,
});

export default AppDataSource;
