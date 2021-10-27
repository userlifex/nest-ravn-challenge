import { Roles, User } from '.prisma/client';
import { Controller, Get, Param, Request } from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async GetMyProfile(@Request() req): Promise<User> {
    return this.usersService.getMyProfile(req.user);
  }

  @Role(Roles.moderator)
  @Get(':id')
  async GetAProfile(@Param() param): Promise<User> {
    return this.usersService.getMyProfile(param);
  }
}
