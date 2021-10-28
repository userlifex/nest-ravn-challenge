import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products/:productId/image')
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @Param('productId') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('hit');

    return this.productsService.addFile(id, file.buffer, file.originalname);
  }

  @Get('products/:productId/image')
  async getPrivateFile(@Param('productId') id: string) {
    console.log('hit');
    return this.productsService.getPrivateFile(id);
  }

  @Public()
  @Get('products')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.productsService.find({ page, perPage });
  }

  @Role(Roles.moderator)
  @Post('products')
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Public()
  @Get('products/:id')
  asyncgetOne(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  @Patch('products/:id')
  @Role(Roles.moderator)
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Delete('products/:id')
  @Role(Roles.moderator)
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Public()
  @Get('categories/:categoryId/products')
  async getAllbyCategory(
    @Param('categoryId') categoryId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.productsService.findManyByCategory(categoryId, {
      page,
      perPage,
    });
  }
}
