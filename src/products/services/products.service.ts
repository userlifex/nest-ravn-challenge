import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { AttachmentService } from 'src/attachment/services/attachment.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { ICrud } from 'src/interfaces/crud.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginateParams, paginationSerializer } from 'src/utils';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductInfoDto } from '../dto/product-info.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService implements ICrud<Product> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService,
    private readonly attachmentService: AttachmentService,
  ) {}

  async addFile(productId: string, imageBuffer: Buffer, filename: string) {
    const image = await this.attachmentService.uploadFile(
      imageBuffer,
      filename,
    );

    const product = await this.findOneById(productId);
    await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        attachment: {
          connect: {
            id: image.id,
          },
        },
      },
    });

    return image;
  }

  async validateStock(productId: string, quantity: number) {
    const produt = await this.findOneById(productId);

    if (quantity > produt.stock) {
      return false;
    }

    return true;
  }

  async getPrivateFile(id: string) {
    const productWithImage = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        attachment: true,
      },
    });

    if (productWithImage) {
      const url = await this.attachmentService.generatePresignedUrl(
        productWithImage.attachment.key,
      );
      return {
        ...productWithImage.attachment,
        url,
      };
    }

    throw new NotFoundException('User with this id does not exist');
  }

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

  async find({ page, perPage }: InputPaginationDto) {
    const prismaPagination = paginateParams({ page, perPage });

    const total = await this.prismaService.product.count({});

    const pageInfo = paginationSerializer(total, { page, perPage });

    const data = await this.prismaService.product.findMany({
      ...prismaPagination,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        numLikes: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      pageInfo,
      data,
    };
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

  async findManyByCategory(
    categoryId: string,
    { page, perPage }: InputPaginationDto,
  ) {
    await this.categoriesService.findOneById(categoryId);

    const prismaPagination = paginateParams({ page, perPage });

    const total = await this.prismaService.product.count({
      where: { categoryId },
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    const data = await this.prismaService.product.findMany({
      ...prismaPagination,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        numLikes: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { categoryId },
    });

    return {
      pageInfo,
      data,
    };
  }
}
