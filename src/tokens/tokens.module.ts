import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TokensService } from './services/tokens.service';

@Module({
  imports: [PrismaModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
