import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from 'src/auth/dto/jwt.payload.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(token: string, payload: JWTPayload): Promise<void> {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    await this.prismaService.token.create({
      data: {
        token,
        userId: payload.sub,
        expirationDate: date,
      },
    });
  }

  async findOne(authHeader): Promise<TokenDto> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    const tokenHeader = authHeader.split('Bearer ')[1].trim();
    const token = this.prismaService.token.findFirst({
      where: {
        token: tokenHeader,
      },
    });

    return token;
  }
}
