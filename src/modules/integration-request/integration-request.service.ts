import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IntegrationStep, RequestStatus, VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';
import { IdentityStepDto } from './dto/identity-step-dto';

import { UserService } from '../user/user.service';
import { VehicleStepDto } from './dto/vehicle-step-dto';
import { DocumentsStepDto } from './dto/documents-step-dto';

@Injectable()
export class IntegrationRequestService {

    constructor(
        @InjectRepository(VehicleIntegrationRequest) private readonly vehicleIntegrationRequestRepository: Repository<VehicleIntegrationRequest>,
        private readonly userService: UserService,  
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

    async createIntegration(dto: IdentityStepDto, userId: number) {
        const user = await this.userService.findById(userId);
        if (!user) throw new NotFoundException();
      
        const request = this.vehicleIntegrationRequestRepository.create({
          userId,
          ...dto,
          identityFilesExpirationDate: new Date(dto.identityFilesExpirationDate),
          currentStep: IntegrationStep.IDENTITY,
          status: RequestStatus.DRAFT,
          isFirstRequest: true,
        });
      
        this.validateStepCompletion(request, IntegrationStep.IDENTITY);
      
        return this.vehicleIntegrationRequestRepository.save(request);
    }
    async completeVehicleStep(
        userId: number,
        dto: VehicleStepDto,
      ) {

        await this.userService.findOneByUserId(userId);
        const existingRequestForUser = await this.vehicleIntegrationRequestRepository.findOneBy({ userId });
        if (!existingRequestForUser) throw new NotFoundException('Cette utilisateur n\'a pas de demande de véhicule en cours');
      
        if (existingRequestForUser.currentStep !== IntegrationStep.IDENTITY) {
          throw new BadRequestException('Étape véhicule non autorisée');
        }
      
        const duplicate = await this.findDuplicateVehicleIntegrationRequest(
          dto.registrationNumber,
          dto.vin,
        );
        if (duplicate) throw new ConflictException('Véhicule déjà enregistré');
      
        Object.assign(existingRequestForUser, dto);
        this.validateStepCompletion(existingRequestForUser, IntegrationStep.VEHICLE);
      
        existingRequestForUser.currentStep = IntegrationStep.VEHICLE;
      
        return this.vehicleIntegrationRequestRepository.save(existingRequestForUser);
    }
      
    async completeDocumentsStep(
        userId: number,
        dto: DocumentsStepDto,
      ) {
        await this.userService.findOneByUserId(userId);
        const existingRequestForUser = await this.vehicleIntegrationRequestRepository.findOneBy({ userId });
        if (!existingRequestForUser) throw new NotFoundException('Cette utilisateur n\'a pas de demande de véhicule en cours');
      
        if (existingRequestForUser.currentStep !== IntegrationStep.VEHICLE) {
          throw new BadRequestException('Étape documents non autorisée');
        }
      
        Object.assign(existingRequestForUser, dto);
        this.validateStepCompletion(existingRequestForUser, IntegrationStep.DOCUMENTS);
      
        existingRequestForUser.currentStep = IntegrationStep.DOCUMENTS;
        existingRequestForUser.status = RequestStatus.PENDING;
      
        return this.vehicleIntegrationRequestRepository.save(existingRequestForUser);
    }
}