import { Test, TestingModule } from '@nestjs/testing';
import { ItemsInCartController } from './items-in-cart.controller';

describe('ItemsInCartController', () => {
  let controller: ItemsInCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsInCartController],
    }).compile();

    controller = module.get<ItemsInCartController>(ItemsInCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
