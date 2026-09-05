import { Test, TestingModule } from '@nestjs/testing';
import { HackthonController } from './hackthon.controller.js';
import { HackthonService } from './hackthon.service.js';

describe('HackthonController', () => {
  let controller: HackthonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackthonController],
      providers: [HackthonService],
    }).compile();

    controller = module.get<HackthonController>(HackthonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
