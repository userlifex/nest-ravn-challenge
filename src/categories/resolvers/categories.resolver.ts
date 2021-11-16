import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { PaginationArgs } from '../../common/dtos/args/pagination.args';
import {
  CategoryModel,
  CursorPaginatedCategories,
  PaginatedCategories,
} from '../dtos/models/category.model';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryInput } from '../dtos/inputs/create-category.input';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';
import { UpdateCategoryInput } from '../dtos/inputs/udpate-category.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CursorPagination } from 'src/common/dtos/args/cursor-pagination.args';
import { ApiLayer } from 'src/utils';

@Resolver('categories')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Query(() => CursorPaginatedCategories)
  async getAllCategories(@Args() args: CursorPagination) {
    const { first, after } = args;
    const categories = await this.categoriesService.find(
      { first, after },
      ApiLayer.GQL,
    );

    return categories;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => CategoryModel)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryModel> {
    const dto = plainToClass(CreateCategoryDto, input);
    const category = await this.categoriesService.create(dto);

    return plainToClass(CategoryModel, category);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => CategoryModel)
  async deleteCategory(@Args('id') id: string): Promise<CategoryModel> {
    const category = await this.categoriesService.delete(id);

    return plainToClass(CategoryModel, category);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => CategoryModel)
  async updateCategory(
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
