import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IntegrationStep, RequestStatus, VehicleIntegrationRequest } from './entities/vehicle-integration-request.entity';
import { IdentityStepDto } from './dto/identity-step-dto';

import { UserService } from '../user/user.service';
import { VehicleStepDto } from './dto/vehicle-step-dto';
import { DocumentsStepDto } from './dto/documents-step-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class IntegrationRequestService {

    constructor(
        @InjectRepository(VehicleIntegrationRequest) private readonly vehicleIntegrationRequestRepository: Repository<VehicleIntegrationRequest>,
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService,
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

    async createIntegration(dto: Omit<IdentityStepDto, 'identityFiles'>, identityFiles: Express.Multer.File[], userId: number) {
        const user = await this.userService.findById(userId);
        if (!user) throw new NotFoundException();

        const identityFileUrls = await this.cloudinaryService.uploadMultipleFiles(identityFiles);
      
        const request = this.vehicleIntegrationRequestRepository.create({
          userId,
          ...dto,
          identityFiles: identityFileUrls,
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
        if (duplicate) throw new ConflictException('Le vin ou le numéro d\'immatriculation est déjà enregistré');
      
        Object.assign(existingRequestForUser, dto);
        this.validateStepCompletion(existingRequestForUser, IntegrationStep.VEHICLE);
      
        existingRequestForUser.currentStep = IntegrationStep.VEHICLE;
      
        return this.vehicleIntegrationRequestRepository.save(existingRequestForUser);
    }
      
    async completeDocumentsStep(
        userId: number,
        dto: DocumentsStepDto,
        files: {
          registrationCardFiles?: Express.Multer.File[],
          insuranceFiles?: Express.Multer.File[],
          technicalInspectionFiles?: Express.Multer.File[],
          photos?: Express.Multer.File[],
        }
      ) {
        await this.userService.findOneByUserId(userId);
        const existingRequestForUser = await this.vehicleIntegrationRequestRepository.findOneBy({ userId });
        if (!existingRequestForUser) throw new NotFoundException('Cette utilisateur n\'a pas de demande de véhicule en cours');
      
        if (existingRequestForUser.currentStep !== IntegrationStep.VEHICLE) {
          throw new BadRequestException('Étape documents non autorisée');
        }

        const [registrationCardUrls, insuranceUrls, technicalInspectionUrls, photosUrls] = await Promise.all([
          files.registrationCardFiles 
              ? this.cloudinaryService.uploadMultipleFiles(files.registrationCardFiles)
              : Promise.resolve([]),
          files.insuranceFiles 
              ? this.cloudinaryService.uploadMultipleFiles(files.insuranceFiles)
              : Promise.resolve([]),
          files.technicalInspectionFiles 
              ? this.cloudinaryService.uploadMultipleFiles(files.technicalInspectionFiles)
              : Promise.resolve([]),
          files.photos 
              ? this.cloudinaryService.uploadMultipleFiles(files.photos)
              : Promise.resolve([]),
          ]);

      
        Object.assign(existingRequestForUser, {
            ...dto,
            registrationCardFiles: registrationCardUrls,
            insuranceFiles: insuranceUrls,
            technicalInspectionFiles: technicalInspectionUrls,
            photos: photosUrls,
            insuranceExpirationDate: new Date(dto.insuranceExpirationDate),
            technicalInspectionExpirationDate: new Date(dto.technicalInspectionExpirationDate),
        });

        this.validateStepCompletion(existingRequestForUser, IntegrationStep.DOCUMENTS);
      
        existingRequestForUser.currentStep = IntegrationStep.DOCUMENTS;
        existingRequestForUser.status = RequestStatus.PENDING;
      
        return this.vehicleIntegrationRequestRepository.save(existingRequestForUser);
    }

    async findById(id: number) {
      const request = await this.vehicleIntegrationRequestRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!request) {
        throw new NotFoundException('Demande d\'intégration non trouvée');
      }
      return request;
    }
  
    async findByUserId(userId: number) {
      const request = await this.vehicleIntegrationRequestRepository.findOne({
        where: { userId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      if (!request) {
        throw new NotFoundException('Aucune demande d\'intégration trouvée pour cet utilisateur');
      }
      return request;
    }
  
    // async findAll() {
    //   return await this.vehicleIntegrationRequestRepository.find({
    //     relations: ['user'],
    //     order: { createdAt: 'DESC' },
    //   });
    // }
}