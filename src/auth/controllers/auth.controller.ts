import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserExist } from 'src/common/guards/user.exist.guard';
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
  async logIn(@Request() req) {
    console.log(req.user);
    return await this.authService.login(req.user);
  }

  @Public()
  @Post('password-recover')
  async PasswordRecover(@Body('email') email: string) {
    return this.authService.passwordRecover(email);
  }
}
