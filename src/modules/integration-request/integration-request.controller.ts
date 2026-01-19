import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IdentityStepDto } from './dto/identity-step-dto';
import { DocumentsStepDto } from './dto/documents-step-dto';
import { VehicleStepDto } from './dto/vehicle-step-dto';
import { JwtAccessGuard } from '../auth/strategy/jwt-access.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(ThrottlerGuard)
@Throttle({ default: { ttl: 60000, limit: 10 } })
@Controller('integration-request')
@UseGuards(JwtAccessGuard)
export class IntegrationRequestController {
  constructor(private readonly integrationRequestService: IntegrationRequestService) {}

  @Post('/vehicle/identity-step')
  @UseInterceptors(FilesInterceptor('identityFiles', 5))
  async createIntegration(@Body() dto: IdentityStepDto, @UploadedFiles() identityFiles: Express.Multer.File[], @Req() req: any) {
    const userId = req.user.id as number;

    if(!identityFiles || identityFiles.length === 0) throw new BadRequestException('Les fichiers sont requis');
    return this.integrationRequestService.createIntegration(dto, identityFiles, userId);
  }

  @Put('/vehicle/vehicle-step')
  async completeVehicleStep(@Body() dto: VehicleStepDto, @Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.completeVehicleStep(userId, dto);
  }

  @Put('/vehicle/documents-step')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'registrationCardFiles', maxCount: 5 },
    { name: 'insuranceFiles', maxCount: 5 },
    { name: 'technicalInspectionFiles', maxCount: 5 },
    { name: 'photos', maxCount: 5 },
  ]))
  async completeDocumentsStep(@Body() dto: DocumentsStepDto, @UploadedFiles() files: {
    registrationCardFiles?: Express.Multer.File[],
    insuranceFiles?: Express.Multer.File[],
    technicalInspectionFiles?: Express.Multer.File[],
    photos?: Express.Multer.File[],
  }, @Req() req: any) {
    const userId = req.user.id as number;

    if(!files?.registrationCardFiles) throw new BadRequestException('Les fichiers de carte d\'immatriculation sont requis');
    if(!files?.insuranceFiles) throw new BadRequestException('Les fichiers d\'assurance sont requis');
    if(!files?.technicalInspectionFiles) throw new BadRequestException('Les fichiers d\'inspection technique sont requis');
    if(!files?.photos) throw new BadRequestException('Les photos sont requises');
    return this.integrationRequestService.completeDocumentsStep(userId, dto, files);
  }

  @Get('my-request')
  async getMyRequest(@Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.findByUserId(userId);
  }

  @Get(':id')
  async getRequestById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ) {
    const userId = req.user.id as number;
    const request = await this.integrationRequestService.findById(id);
    
    if (request.userId !== userId) {
      throw new BadRequestException('Vous n\'avez pas accès à cette demande');
    }
    
    return request;
  }
}
