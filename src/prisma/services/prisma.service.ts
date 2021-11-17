import {
  INestApplication,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      rejectOnNotFound: (error: Error) => new NotFoundException(error.message),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async clearDatabase() {
    await this.like.deleteMany({});
    await this.itemsInCart.deleteMany({});
    await this.shopCart.deleteMany({});
    await this.category.deleteMany({});
    await this.product.deleteMany({});
    await this.shopCart.deleteMany({});
    await this.token.deleteMany({});
    await this.user.deleteMany({});
  }

  async getBounds(model: string) {
    const firstElement = await this[`${model}`].findMany({
      select: {
        id: true,
      },
      take: 1,
    });

    const lastElement = await this[`${model}`].findMany({
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });

    return { firstCursor: firstElement[0].id, lastCursor: lastElement[0].id };
  }
}
