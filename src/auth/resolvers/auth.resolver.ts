import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserExist } from '../../common/guards/user.exist.guard';
import { UserEntity } from '../../common/types';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LogInInput } from '../dto/inputs/login.input';
import { SignUpInput } from '../dto/inputs/signup.input';
import { GqlLocalAuthGuard } from '../guards/gql-local-auth.guard';
import { PasswordRecoverModel } from '../models/password-recover.model';
import { TokenModel } from '../models/token.model';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(UserExist)
  @Mutation(() => UserModel)
  async signUp(@Args('data') input: SignUpInput): Promise<UserModel> {
    return this.authService.signup(input);
  }

  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => TokenModel)
  async logIn(
    @CurrentUser() user: UserEntity,
    @Args('data') data: LogInInput,
  ): Promise<TokenModel> {
    return this.authService.login(user.email);
  }

  @Mutation(() => PasswordRecoverModel)
  async recoverPassword(@Args('email') email: string) {
    return this.authService.passwordRecover(email);
  }

  @Mutation(() => PasswordRecoverModel)
  async changePassword(
    @Args('token') token: string,
    @Args('password') password: string,
  ) {
    return this.authService.changePassword(token, password);
  }
}
