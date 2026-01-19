import { Module } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IntegrationRequestController } from './integration-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [IntegrationRequestController],
  providers: [IntegrationRequestService],
  imports: [TypeOrmModule.forFeature([VehicleIntegrationRequest]), UserModule, AuthModule, CloudinaryModule],
  exports: [IntegrationRequestService],
})
export class IntegrationRequestModule {}
