import { Test, TestingModule } from '@nestjs/testing';
import { ShopcartsService } from './shopcarts.service';

describe('ShopcartsService', () => {
  let service: ShopcartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopcartsService],
    }).compile();

    service = module.get<ShopcartsService>(ShopcartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
