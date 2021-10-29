import { Test, TestingModule } from '@nestjs/testing';
import { ItemsOrderedService } from './items-ordered.service';

describe('ItemsOrderedService', () => {
  let service: ItemsOrderedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsOrderedService],
    }).compile();

    service = module.get<ItemsOrderedService>(ItemsOrderedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
