import { Module } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IntegrationRequestController } from './integration-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [IntegrationRequestController],
  providers: [IntegrationRequestService],
  imports: [TypeOrmModule.forFeature([VehicleIntegrationRequest]), UserModule],
  exports: [IntegrationRequestService],
})
export class IntegrationRequestModule {}
