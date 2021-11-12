import { Roles } from '.prisma/client';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { UserModel } from 'src/auth/models/user.model';
import { Role } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserEntity } from 'src/common/types';
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
