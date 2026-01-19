import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationRequestController } from './integration-request.controller';
import { IntegrationRequestService } from './integration-request.service';

describe('IntegrationRequestController', () => {
  let controller: IntegrationRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationRequestController],
      providers: [IntegrationRequestService],
    }).compile();

    controller = module.get<IntegrationRequestController>(IntegrationRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
