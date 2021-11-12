import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { PaginationArgs } from '../../common/dtos/args/pagination.args';
import {
  CategoryModel,
  PaginatedCategories,
} from '../dto/models/category.model';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryInput } from '../dto/inputs/create-category.input';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { UpdateCategoryInput } from '../dto/inputs/udpate-category.input';

@Resolver('categories')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Query((returns) => PaginatedCategories)
  async getAllCategories(@Args() args: PaginationArgs) {
    const { page, perPage } = args;
    const categories = await this.categoriesService.find({ page, perPage });

    return categories;
  }

  @Public()
  @Mutation(() => CategoryModel)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryModel> {
    const dto = plainToClass(CreateCategoryDto, input);
    const category = await this.categoriesService.create(dto);

    return plainToClass(CategoryModel, category);
  }

  @Public()
  @Mutation(() => CategoryModel)
  async deleteCategory(@Args('id') id: string): Promise<CategoryModel> {
    const category = await this.categoriesService.delete(id);

    return plainToClass(CategoryModel, category);
  }

  @Public()
  @Mutation(() => CategoryModel)
  async de(
    @Args('input') input: UpdateCategoryInput,
    @Args('id') id: string,
  ): Promise<CategoryModel> {
    const dto = plainToClass(UpdateCategoryDto, input);
    const category = await this.categoriesService.update(id, dto);

    return plainToClass(CategoryModel, category);
  }
  @Public()
  @Query(() => CategoryModel)
  async getOneCategory(@Args('id') id: string): Promise<CategoryModel> {
    const category = await this.categoriesService.findOneById(id);

    return plainToClass(CategoryModel, category);
  }
}
