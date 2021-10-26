import { Roles } from '.prisma/client';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { AuthService } from './auth.service';
import { SignUpData } from './dto/signup.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: SignUpData) {
    return await this.authService.signup(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Request() req) {
    console.log(req.user);
    return await this.authService.login(req.user);
  }
}
