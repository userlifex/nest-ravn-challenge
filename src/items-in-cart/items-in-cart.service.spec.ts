import { Test, TestingModule } from '@nestjs/testing';
import { ItemsInCartService } from './items-in-cart.service';

describe('ItemsInCartService', () => {
  let service: ItemsInCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsInCartService],
    }).compile();

    service = module.get<ItemsInCartService>(ItemsInCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
