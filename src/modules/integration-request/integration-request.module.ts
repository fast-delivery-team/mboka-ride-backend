import { Module } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IntegrationRequestController } from './integration-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';
import { UserService } from '../user/user.service';

@Module({
  controllers: [IntegrationRequestController],
  providers: [IntegrationRequestService, UserService],
  imports: [TypeOrmModule.forFeature([VehicleIntegrationRequest])],
  exports: [IntegrationRequestService],
})
export class IntegrationRequestModule {}
