import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dto/response/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx: Array<{ user: UserDto }> = context.getArgs();

    return ctx[0].user;
  },
);
