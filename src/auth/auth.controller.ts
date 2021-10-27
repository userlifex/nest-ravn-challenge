import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserExist } from 'src/common/guards/user.exist.guard';
import { AuthService } from './auth.service';
import { SignUpData } from './dto/signup.dto';
import { LocalAuthGuard } from './local-auth.guard';

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
}
