import { Controller } from '@nestjs/common';
import { IntegrationRequestService } from './integration-request.service';

@Controller('integration-request')
export class IntegrationRequestController {
  constructor(private readonly integrationRequestService: IntegrationRequestService) {}
}
