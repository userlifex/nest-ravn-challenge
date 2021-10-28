import { Controller, Param, Post } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { UserEntity } from 'src/common/types';
import { LikesService } from '../services/likes.service';

@Controller('')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Post('products/:productId/like')
  @Role(Roles.customer)
  async likeProduct(
    @CurrentUser() user: UserEntity,
    @Param('productId') productId: string,
  ) {
    return this.likesService.likeProduct(productId, user.id);
  }
}
