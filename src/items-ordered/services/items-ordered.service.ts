import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class ItemsOrderedService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByOrderId(orderId: string) {
    const items = await this.prismaService.itemOrdered.findMany({
      where: {
        orderId,
      },
    });

    return items;
  }
}
