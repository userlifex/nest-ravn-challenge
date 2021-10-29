import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { AttachmentService } from 'src/attachment/services/attachment.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { ICrud } from 'src/interfaces/crud.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginateParams, paginationSerializer } from 'src/utils';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductInfoDto } from '../dto/product-info.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ProductsService implements ICrud<Product> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
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

  async getPrivateFile(productId: string) {
    const productWithImage = await this.prismaService.product.findUnique({
      where: {
        id: productId,
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

    const data = [];

    const products = await this.prismaService.product.findMany({
      ...prismaPagination,
      include: {
        attachment: true,
        category: true,
      },
    });

    for (const product of products) {
      const productWithImage = await this.getProductWithImg(product);
      data.push(productWithImage);
    }

    return {
      pageInfo,
      data,
    };
  }

  async getProductWithImg(product) {
    let imgUrl = '';
    if (product.attachment) {
      const attachment = await this.getPrivateFile(product.id);
      imgUrl = attachment.url;
    }

    const { id, name, stock, price, createdAt, updatedAt, category } = product;

    return {
      id,
      name,
      stock,
      price,
      imgUrl,
      category,
      updatedAt,
      createdAt,
    };
  }

  async findOneByIdWithImg(id: string) {
    const product = this.validateById(id);
    const productWithImage = await this.getProductWithImg(product);

    return productWithImage;
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

  async hasAttachment(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      select: {
        attachment: true,
      },
    });

    if (!product.attachment) return false;

    return true;
  }
  async sendEmailToLastUserLikes(product) {
    if (!product.lastLikeUserId) return;
    const hasAttachment = await this.hasAttachment(product.id);
    let url = '';
    if (hasAttachment) {
      const file = await this.getPrivateFile(product.id);
      url = file.url;
    }

    const user = await this.usersService.findOneById(product.lastLikeUserId);

    await this.usersService.sendEmailToUser(user.email, {
      subject: `Liked products`,
      message: `A product that you like is running out of stock, if you want to take it, do not hesitate to look for it in our store before it is too late`,
      link: url,
    });
  }
}
