import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { PrismaService } from '../../prisma/services/prisma.service';
import { RESTpaginateParams, RESTpaginationSerializer } from '../../utils';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';

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

  async find({ page, perPage }: InputPaginationDto) {
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
