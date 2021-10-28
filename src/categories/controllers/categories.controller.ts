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
import { Roles } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get('categories')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return await this.categoriesService.find({ page, perPage });
  }

  @Post('categories')
  @Role(Roles.moderator)
  async create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Public()
  @Get('categories/:id')
  async getOne(@Param('id') id: string) {
    return this.categoriesService.findOneById(id);
  }

  @Patch('categories/:id')
  @Role(Roles.moderator)
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }

  @Delete('categories/:id')
  @Role(Roles.moderator)
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
