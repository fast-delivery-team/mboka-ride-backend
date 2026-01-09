import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IntegrationStep, VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';


@Injectable()
export class IntegrationRequestService {

    constructor(
        @InjectRepository(VehicleIntegrationRequest) private readonly vehicleIntegrationRequestRepository: Repository<VehicleIntegrationRequest>,
    ) {}

    private validateStepCompletion(
        request: VehicleIntegrationRequest,
        step: IntegrationStep,
      ) {
        if (step === IntegrationStep.IDENTITY) {
          if (!request.documentType || !request.identityFiles?.length || !request.identityFilesExpirationDate) {
            throw new BadRequestException('Étape identité incomplète');
          }
        }
      
        if (step === IntegrationStep.VEHICLE) {
          if (!request.registrationNumber || !request.vin || !request.brand) {
            throw new BadRequestException('Étape véhicule incomplète');
          }
        }

        if (step === IntegrationStep.DOCUMENTS) {
          if (!request.registrationCardFiles?.length || !request.insuranceFiles?.length || !request.insuranceExpirationDate) {
            throw new BadRequestException('Étape documents incomplète');
          }
        }
      }

    async findDuplicateVehicleIntegrationRequest(registrationNumber?: string, vin?: string, documentTypeNumber?: string) {

        const valuesToCheck: string[] = [];
        if(registrationNumber) {
            valuesToCheck.push(registrationNumber);
        }
        if(vin) {
            valuesToCheck.push(vin);
        }
        if(documentTypeNumber) {
            valuesToCheck.push(documentTypeNumber);
        }
        return await this.vehicleIntegrationRequestRepository.findOneBy({ 
            registrationNumber: In(valuesToCheck),
            vin: In(valuesToCheck),
            documentTypeNumber: In(valuesToCheck),
        });
    }


}
