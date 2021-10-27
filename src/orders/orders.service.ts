import { Injectable } from '@nestjs/common';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginateParams, paginationSerializer } from 'src/utils';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async find({ page, perPage }: InputPaginationDto) {
    const prismaPagination = paginateParams({ page, perPage });

    const total = await this.prismaService.order.count({});

    const pageInfo = paginationSerializer(total, { page, perPage });

    const data = await this.prismaService.order.findMany({
      include: {
        user: true,
      },
    });

    return {
      pageInfo,
      data,
    };
    //async createOrder(userId: string, shopCartId: string) {}
  }
}
