import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async getAll() {
    return this.categoriesService.find();
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
