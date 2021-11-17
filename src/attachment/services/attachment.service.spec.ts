import { UploadedFile } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Attachment } from '@sendgrid/helpers/classes';
import { S3 } from 'aws-sdk';
import { awsConfig, s3MockService } from '../../common/mocks/default.mock';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { AttachmentService } from './attachment.service';

describe('Service', () => {
  let attachmentService: AttachmentService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule.forFeature(awsConfig)],
      providers: [
        AttachmentService,
        { provide: S3, useFactory: s3MockService },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    attachmentService = module.get<AttachmentService>(AttachmentService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should attachment be defined', () => {
    expect(attachmentService).toBeDefined();
  });

  it('should upload a file to s3', async () => {
    const attachment = await attachmentService.uploadFile(
      Buffer.from('ok'),
      'test.png',
    );
    expect(attachment).toHaveProperty('id');
  });

  it('should generate a presigned url', async () => {

    const attachment = await attachmentService.uploadFile(
      Buffer.from('ok'),
      'test.png',
    );
    const presignedUrl = await attachmentService.generatePresignedUrl(
      attachment.key,
    );
    expect(presignedUrl.includes('AWSAccessKeyId')).toBeTruthy();
  });
});
