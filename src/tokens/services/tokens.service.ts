import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Token } from '@prisma/client';
import { JWTPayload } from '../../auth/dto/response/jwt.payload.dto';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class TokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(token: string, payload: JWTPayload): Promise<Token> {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return await this.prismaService.token.create({
      data: {
        token,
        userId: payload.sub,
        expirationDate: date,
      },
    });
  }

  async findUserId(token: string) {
    const user = await this.prismaService.token.findFirst({
      where: {
        token: token,
      },
      select: {
        userId: true,
      },
    });

    return user;
  }
}
