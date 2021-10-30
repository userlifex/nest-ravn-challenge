import { registerAs } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { S3 } from 'aws-sdk';
import { SendgridService } from '../sendgrid/services/sendgrid.service';

type Mock<T> = Record<keyof T, jest.Mock>;
export type PartialMock<T> = Partial<Mock<T>>;

export const jwtMockService = (): PartialMock<JwtService> => ({
  verifyAsync: jest.fn().mockImplementation(() => ({
    jti: 'ab0ab1a-b0ab2030405',
  })),
  signAsync: jest.fn().mockImplementation(() => 'my.jwt.token'),
  decode: jest.fn(),
});

export const jwtConfigMock = registerAs('jwt', () => ({
  jwtSecret: 'secret',
}));

export const sendGridMockService = (): Mock<SendgridService> => ({
  createEmail: jest.fn(),
});

export const s3MockService = (): PartialMock<S3> => ({
  getSignedUrl: jest.fn().mockImplementation(() => 'http://example.com'),
  upload: jest.fn().mockReturnThis(),
});

export const awsConfig = registerAs('s3', () => ({
  accessKeyId: 'test_access_key',
  secretAccessKey: 'test_secret_key',
  region: 'test_region',
  bucket: 'test_bucket',
  expirationTime: 900,
}));

