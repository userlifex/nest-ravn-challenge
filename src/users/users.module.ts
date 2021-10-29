import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { SengridService } from 'src/common/sengrid/sengrid.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, SengridService],
  exports: [UsersService],
})
export class UsersModule {}
