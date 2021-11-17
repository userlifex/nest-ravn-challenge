import { Args, Mutation } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../common/types';
import { LikeModel } from '../dtos/models/like.model';
import { LikesService } from '../services/likes.service';

export class LikeResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => LikeModel)
  async likeProduct(
    @CurrentUser() user: UserEntity,
    @Args('productId') productId: string,
  ): Promise<LikeModel> {
    const like = await this.likesService.likeProduct(productId, user.id);

    return plainToClass(LikeModel, like);
  }
}
