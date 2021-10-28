import { Roles, User } from '.prisma/client';
import { Controller, Get, Param, Request } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { UserEntity } from 'src/common/types';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async GetMyProfile(@CurrentUser() user: UserEntity): Promise<User> {
    return this.usersService.getMyProfile(user.id);
  }

  @Role(Roles.moderator)
  @Get(':id')
  async GetAProfile(@Param('id') userId: string): Promise<User> {
    return this.usersService.findOneById(userId);
  }
}
