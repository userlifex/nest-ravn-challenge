import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokensService: TokensService,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    const token = async () => {
      await this.tokensService.findOne(authHeader);
    };

    if (token) {
      return true;
    }

    return false;
  }
}
