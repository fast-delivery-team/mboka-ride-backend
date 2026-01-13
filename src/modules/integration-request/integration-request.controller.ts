import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IdentityStepDto } from './dto/identity-step-dto';
import { DocumentsStepDto } from './dto/documents-step-dto';
import { VehicleStepDto } from './dto/vehicle-step-dto';

@Controller('integration-request')
export class IntegrationRequestController {
  constructor(private readonly integrationRequestService: IntegrationRequestService) {}

  @Post('/vehicle/identity-step')
  async createIntegration(@Body() dto: IdentityStepDto, @Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.createIntegration(dto, userId);
  }

  @Post('/vehicle/vehicle-step')
  async completeVehicleStep(@Body() dto: VehicleStepDto, @Req() _req: any, @Param('requestId') requestId: number) {
    return this.integrationRequestService.completeVehicleStep(requestId, dto);
  }

  @Post('/vehicle/documents-step')
  async completeDocumentsStep(@Body() dto: DocumentsStepDto, @Req() _req: any, @Param('requestId') requestId: number) {
    return this.integrationRequestService.completeDocumentsStep(requestId, dto);
  }
}
