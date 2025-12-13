import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import databaseConfig, { getConfig } from './config/database/database.config';
import { DatabaseConfig } from './config/database/database-config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      // envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (): DatabaseConfig => getConfig(),
    }),
    UserModule,
  ],
})
export class AppModule {}
