import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { InputPaginationDto } from '../../common/dtos/input-pagination.dto';
import { plainToClass } from 'class-transformer';
import { getEdges } from '../../common/dtos/args/cursor-pagination.args';
import { InputPaginationDto } from '../../common/dtos/input-pagination.dto';

import { PrismaService } from '../../prisma/services/prisma.service';
import {
  ApiLayer,
  GQLpaginateParams,
  GQLPageSerializer,
  RESTpaginateParams,
  RESTpaginationSerializer,
} from '../../utils';
import {
  CategoryModel,
  CursorPaginatedCategories,
} from '../dtos/models/category.model';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';
import { InfoCategoryDto } from '../dtos/response/info-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateCategoryDto): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: {
        name: input.name,
      },
      rejectOnNotFound: false,
    });

    if (category) {
      throw new BadRequestException('Category already exists');
    }

    return await this.prismaService.category.create({
      data: {
        ...input,
      },
    });
  }

  private async findRest({ page, perPage }: InputPaginationDto) {
    const prismaPagination = RESTpaginateParams({ page, perPage });

    const total = await this.prismaService.category.count({});

    const pageInfo = RESTpaginationSerializer(total, { page, perPage });

    const data = await this.prismaService.category.findMany({
      ...prismaPagination,
    });

    return {
      pageInfo,
      data,
    };
  }

  private async findGQL({
    first,
    after,
  }: InputPaginationDto): Promise<CursorPaginatedCategories> {
    const prismaPagination = GQLpaginateParams({ first, after });

    const { firstCursor, lastCursor } = await this.prismaService.getBounds(
      'category',
    );

    const data = await this.prismaService.category.findMany({
      ...prismaPagination,
    });

    const edges = getEdges(plainToClass(CategoryModel, data));
    const pageInfo = GQLPageSerializer<Category>(firstCursor, lastCursor, data);

    return {
      edges,
      pageInfo,
    };
  }

  async find(pagination: InputPaginationDto, layer = ApiLayer.REST) {
    if (layer === ApiLayer.GQL) {
      return this.findGQL(pagination);
    }

    return this.findRest(pagination);
  }

  async findOneById(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, input: UpdateCategoryDto): Promise<Category> {
    await this.findOneById(id);

    return this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  async delete(id: string): Promise<Category> {
    await this.findOneById(id);

    return this.prismaService.category.delete({ where: { id } });
  }
}
