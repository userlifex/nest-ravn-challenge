import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CategoriesService } from './categories.service';
import * as utils from '../../utils';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CategoriesService],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    //module.close();
  });

  it('should categories services should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  it('should prisma should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should create a category', async () => {
    const category = await categoriesService.create({ name: 'choclatey' });
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
  });

  it('should throw error if category already exists', async () => {
    await categoriesService.create({ name: 'choclatey' });
    expect(async () => {
      await categoriesService.create({ name: 'choclatey' });
    }).rejects.toThrow();
  });

  it('should delete a category', async () => {
    const category = await categoriesService.create({ name: 'choclatey' });
    const categoryDeleted = await categoriesService.delete(category.id);

    expect(category.id).toBe(categoryDeleted.id);
  });

  it('should return a category by id', async () => {
    const category = await categoriesService.create({ name: 'choclatey' });
    const searchedCategory = await categoriesService.findOneById(category.id);
    expect(category.id).toBe(searchedCategory.id);
  });

  it('should throw an error if a category does not exists', async () => {
    expect(async () => {
      await categoriesService.findOneById('my.category.id');
    }).rejects.toThrow();
  });

  it('should return all categories', async () => {
    const categories = await categoriesService.find({ page: 1, perPage: 10 });
    const spy = jest.spyOn(utils, 'RESTpaginateParams');

    const paginate = utils.RESTpaginateParams({ page: 1, perPage: 10 });

    expect(spy).toHaveBeenCalled();
    expect(paginate).toEqual({ take: 10, skip: 0 });
    expect(categories).toHaveProperty('pageInfo');
    expect(categories).toHaveProperty('data');
    spy.mockRestore();
  });

  it('should update a category', async () => {
    const category = await prismaService.category.create({
      data: { name: 'choclatey' },
    });
    const updateCategory = await categoriesService.update(category.id, {
      name: 'new category',
    });
    expect(updateCategory.id).toBe(category.id);
    expect(updateCategory.name).not.toBe(category.name);
  });
});
