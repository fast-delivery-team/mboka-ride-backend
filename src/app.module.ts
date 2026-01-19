import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import databaseConfig, { getConfig } from './config/database/database.config';
import { DatabaseConfig } from './config/database/database-config.types';
import { AuthModule } from './modules/auth/auth.module';
import { IntegrationRequestModule } from './modules/integration-request/integration-request.module';
import { EmailModule } from './email/email.module';

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
    AuthModule,
    IntegrationRequestModule,
    EmailModule,
  ],
})
export class AppModule {}
