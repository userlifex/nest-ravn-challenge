import { Roles, User } from '.prisma/client';
import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { UserEntity } from '../../common/types';
import { UserProfileDto } from '../dto/response/user.profile.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async GetMyProfile(@CurrentUser() user: UserEntity): Promise<UserProfileDto> {
    return this.usersService.getMyProfile(user.id);
  }

  @Role(Roles.moderator)
  @Get(':id')
  async GetAProfile(@Param('id') userId: string): Promise<User> {
    return this.usersService.findOneById(userId);
  }
}
