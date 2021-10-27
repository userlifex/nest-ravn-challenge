import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/common/decorators/public.decorator';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { ProductsService } from 'src/products/products.service';
import { paginateParams } from 'src/utils';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return await this.categoriesService.find({ page, perPage });
  }

  @Post('')
  async create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.categoriesService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  @Get(':id/products')
  async getProductsByCategory(@Param('id') id: string) {
    return this.productsService.findManyByCategory(id);
  }
}
