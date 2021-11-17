import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemsOrderedController } from './controllers/items-ordered.controller';
import { ItemsOrderedService } from './services/items-ordered.service';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsOrderedController],
  providers: [ItemsOrderedService],
  exports: [ItemsOrderedService],
})
export class ItemsOrderedModule {}
