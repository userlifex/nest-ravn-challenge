import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3, S3Control, S3Outposts } from 'aws-sdk';
import { PrismaModule } from '../prisma/prisma.module';
import { AttachmentService } from './services/attachment.service';

@Module({
  imports: [PrismaModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
