import { Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { UserEntity } from '../../common/types';
import { LikesService } from '../services/likes.service';

@ApiTags('likes')
@Controller('')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Post('products/:id/like')
  @Role(Roles.customer)
  async likeProduct(
    @CurrentUser() user: UserEntity,
    @Param('id') productId: string,
  ) {
    return this.likesService.likeProduct(productId, user.id);
  }
}
