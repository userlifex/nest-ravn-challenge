import { Test, TestingModule } from '@nestjs/testing';
import { ItemsOrderedController } from './items-ordered.controller';

describe('ItemsOrderedController', () => {
  let controller: ItemsOrderedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsOrderedController],
    }).compile();

    controller = module.get<ItemsOrderedController>(ItemsOrderedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
