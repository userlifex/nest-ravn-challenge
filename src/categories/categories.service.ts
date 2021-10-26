import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { ICrud } from 'src/interfaces/crud.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService implements ICrud<Category> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateCategoryDto): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: {
        name: input.name,
      },
      rejectOnNotFound: false,
    });

    if (category) {
      throw new BadRequestException('resource already exists');
    }

    return this.prismaService.category.create({
      data: {
        ...input,
      },
    });
  }

  async find(): Promise<Category[]> {
    return this.prismaService.category.findMany({});
  }

  async findOneById(id: string): Promise<Category> {
    const category = await this.validateById(id);

    return category;
  }

  async update(id: string, input: UpdateCategoryDto): Promise<Category> {
    await this.validateById(id);

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
    await this.validateById(id);

    return this.prismaService.category.delete({ where: { id } });
  }

  async validateById(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }
}
