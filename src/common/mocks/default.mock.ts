import { registerAs } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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

export const sendGridMockService = (): PartialMock<SendgridService> => ({});
