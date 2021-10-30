import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async likeProduct(productId: string, userId: string) {
    const product = await this.productsService.findOneById(productId);

    const count = await this.prismaService.like.count({
      where: { productId, userId },
    });

    if (count > 0) {
      throw new BadRequestException('like already exists');
    }

    const numLikes = product.numLikes + 1;
    await this.productsService.update(productId, {
      numLikes,
      lastLikeUserId: userId,
    });

    return this.prismaService.like.create({
      data: {
        userId,
        productId,
      },
    });
  }
}
