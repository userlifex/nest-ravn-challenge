import { Attachment } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PrismaService } from '../../prisma/services/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(databuffer: Buffer, filename: string): Promise<Attachment> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Body: databuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    console.log(uploadResult);

    const newFile = await this.prismaService.attachment.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    });

    return newFile;
  }

  async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
  }
}
