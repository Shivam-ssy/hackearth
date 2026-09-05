import { Test, TestingModule } from '@nestjs/testing';
import { HackthonService } from './hackthon.service.js';

describe('HackthonService', () => {
  let service: HackthonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HackthonService],
    }).compile();

    service = module.get<HackthonService>(HackthonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
