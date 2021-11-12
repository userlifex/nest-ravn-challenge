import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { SendgridService } from '../common/sendgrid/services/sendgrid.service';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  imports: [PrismaModule, SendgridModule],
  controllers: [UsersController],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
})
export class UsersModule {}
