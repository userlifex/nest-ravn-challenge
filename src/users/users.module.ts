import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { SendgridService } from '../common/sendgrid/services/sendgrid.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, SendgridService],
  exports: [UsersService],
})
export class UsersModule {}
