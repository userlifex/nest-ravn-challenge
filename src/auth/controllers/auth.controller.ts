import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UserExist } from '../../common/guards/user.exist.guard';
import { SignUpDto } from '../dto/request/signup.dto';
import { LoginDto } from '../dto/request/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from 'src/common/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(UserExist)
  @Post('signup')
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signup(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@CurrentUser() user: UserEntity) {
    return await this.authService.login(user.email);
  }

  @Post('password-recover')
  async PasswordRecover(@Body('email') email: string) {
    return this.authService.passwordRecover(email);
  }

  @Patch('/:token/change-password')
  async ChangePassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.changePassword(token, password);
  }
}
