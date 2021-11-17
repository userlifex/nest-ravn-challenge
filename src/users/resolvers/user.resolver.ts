import { Roles } from '.prisma/client';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt.guard';
import { UserModel } from '../../auth/models/user.model';
import { Role } from '../../common/decorators/role.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { UserEntity } from '../../common/types';
import { UserProfileModel } from '../models/user-profile.model';
import { UsersService } from '../services/users.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => UserProfileModel)
  async getMyProfile(
    @CurrentUser() user: UserEntity,
  ): Promise<UserProfileModel> {
    return this.usersService.getMyProfile(user.id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Query(() => UserModel)
  async getAProfile(@Args('userId') userId: string): Promise<UserModel> {
    return this.usersService.findOneById(userId);
  }
}
