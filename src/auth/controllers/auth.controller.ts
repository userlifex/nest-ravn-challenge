import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { UserExist } from '../../common/guards/user.exist.guard';
import { UserEntity } from '../../common/types';
import { CurrentUser } from '../decorators/current-user.decorator';
import { SignUpData } from '../dto/request/signup.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(UserExist)
  @Post('signup')
  async signUp(@Body() user: SignUpData) {
    return await this.authService.signup(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@CurrentUser() user: UserEntity) {
    console.log(user);
    return await this.authService.login(user);
  }

  @Public()
  @Post('password-recover')
  async PasswordRecover(@Body('email') email: string) {
    return this.authService.passwordRecover(email);
  }

  @Public()
  @Patch('/:token/change-password')
  async ChangePassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.changePassword(token, password);
  }
}
