import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AttachmentService } from './services/attachment.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
