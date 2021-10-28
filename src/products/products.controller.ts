import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getAll() {
    return this.productsService.find();
  }

  @Post()
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
