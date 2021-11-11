import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { CategoryModel } from '../dto/models/category.model';
import { CategoriesService } from '../services/categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Query((returns) => [CategoryModel])
  async categories(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const categories = await this.categoriesService.find({ page, perPage });

    return categories.data;
  }
}
