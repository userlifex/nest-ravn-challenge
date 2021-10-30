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
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsService } from '../services/products.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get('products')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.productsService.find({ page, perPage });
  }

  @Role(Roles.customer)
  @Post('products')
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Public()
  @Get('products/:id')
  async getOne(@Param('id') id: string) {
    return this.productsService.findOneByIdWithImg(id);
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

  @Post('products/:id/image')
  @Role(Roles.moderator)
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.addFile(id, file.buffer, file.originalname);
  }

  @Role(Roles.moderator)
  @Get('products/:id/image')
  async getPrivateFile(@Param('id') productId: string) {
    return this.productsService.getPrivateFile(productId);
  }

  @Public()
  @Get('categories/:id/products')
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
