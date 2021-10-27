import { Test, TestingModule } from '@nestjs/testing';
import { ShopcartsController } from './shopcarts.controller';

describe('ShopcartsController', () => {
  let controller: ShopcartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopcartsController],
    }).compile();

    controller = module.get<ShopcartsController>(ShopcartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
