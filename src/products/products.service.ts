import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CategoriesService } from 'src/categories/categories.service';
import { ICrud } from 'src/interfaces/crud.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductInfoDto } from './dto/product-info.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements ICrud<Product> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(input: CreateProductDto): Promise<Product> {
    if (input?.categoryId) {
      await this.categoriesService.findOneById(input.categoryId);
    }

    return await this.prismaService.product.create({
      data: {
        ...input,
      },
    });
  }

  async find(): Promise<ProductInfoDto[]> {
    return this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        numLikes: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOneById(id: string): Promise<Product> {
    const product = this.validateById(id);

    return product;
  }

  async update(id: string, input: UpdateProductDto): Promise<Product> {
    await this.validateById(id);
    if (input.categoryId) {
      await this.categoriesService.findOneById(input.categoryId);
    }

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        ...input,
        categoryId: input.categoryId || null,
      },
    });
  }

  async delete(id: string): Promise<Product> {
    await this.validateById(id);

    return this.prismaService.product.delete({ where: { id } });
  }

  async validateById(id: string): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      rejectOnNotFound: false,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findManyByCategory(categoryId: string): Promise<Product[]> {
    await this.categoriesService.findOneById(categoryId);

    return this.prismaService.product.findMany({ where: { categoryId } });
  }
}
