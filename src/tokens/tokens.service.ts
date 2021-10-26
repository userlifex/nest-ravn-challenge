import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenDto } from './dto/create.token.dto';
import { TokenDto } from './dto/toke.dto';

@Injectable()
export class TokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(token, payload): Promise<CreateTokenDto> {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return await this.prismaService.token.create({
      select: {
        token: true,
        expirationDate: true,
        userId: true,
      },
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
      select: {
        id: true,
        token: true,
        expirationDate: true,
        userId: true,
      },
      where: {
        token: tokenHeader,
      },
    });

    return token;
  }
}
