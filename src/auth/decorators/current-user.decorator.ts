import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { UserDto } from '../dto/response/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      console.log(ctx.getContext().req.user);

      return ctx.getContext().req.user;
    } else {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
  },
);
