import { Roles } from '.prisma/client';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Roles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return this.validateRequest(user, requiredRole);
  }

  async validateRequest(user, requiredRole) {
    const userInfo = await this.usersService.findOneById(user.sub);
    return requiredRole == userInfo.roles;
  }
}
