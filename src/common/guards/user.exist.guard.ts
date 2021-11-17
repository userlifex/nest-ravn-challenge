import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoginDto } from '../../auth/dto/request/login.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class UserExist implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const input = this.getRequestFromContext(context);

    return this.validateRequest(input);
  }

  async validateRequest(input: LoginDto) {
    const userExist = await this.usersService.findOneByEmail(input.email);

    if (userExist) {
      throw new ConflictException('This email already exist');
    }
    return true;
  }

  private getRequestFromContext(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      console.log(GqlExecutionContext.create(context).getContext());

      const args = GqlExecutionContext.create(context).getArgs();
      return args.data;
    } else {
      const request = context.switchToHttp().getRequest<Request>();
      return request.body;
    }
  }
}
