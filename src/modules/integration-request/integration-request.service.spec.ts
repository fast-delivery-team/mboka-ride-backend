import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationRequestService } from './integration-request.service';

describe('IntegrationRequestService', () => {
  let service: IntegrationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationRequestService],
    }).compile();

    service = module.get<IntegrationRequestService>(IntegrationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
