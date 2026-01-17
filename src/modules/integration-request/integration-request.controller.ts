import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';
import { IdentityStepDto } from './dto/identity-step-dto';
import { DocumentsStepDto } from './dto/documents-step-dto';
import { VehicleStepDto } from './dto/vehicle-step-dto';
import { JwtAccessGuard } from '../auth/strategy/jwt-access.guard';

@Controller('integration-request')
@UseGuards(JwtAccessGuard)
export class IntegrationRequestController {
  constructor(private readonly integrationRequestService: IntegrationRequestService) {}

  @Post('/vehicle/identity-step')
  async createIntegration(@Body() dto: IdentityStepDto, @Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.createIntegration(dto, userId);
  }

  @Put('/vehicle/vehicle-step')
  async completeVehicleStep(@Body() dto: VehicleStepDto, @Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.completeVehicleStep(userId, dto);
  }

  @Put('/vehicle/documents-step')
  async completeDocumentsStep(@Body() dto: DocumentsStepDto, @Req() req: any) {
    const userId = req.user.id as number;
    return this.integrationRequestService.completeDocumentsStep(userId, dto);
  }
}
