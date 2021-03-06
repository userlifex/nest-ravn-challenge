import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { SendgridService } from '../../common/sendgrid/services/sendgrid.service';
import { TokenDto } from '../../tokens/dto/token.dto';
import { TokensService } from '../../tokens/services/tokens.service';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/request/login.dto';
import { SignUpDto } from '../dto/request/signup.dto';
import { PasswordRecoverDto } from '../dto/response/password.recover.dto';
import { UserDto } from '../dto/response/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sengridService: SendgridService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    user.password = undefined;
    return user;
  }

  async signup(signUpDto: SignUpDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(signUpDto.password);

    const createdUser = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });
    createdUser.password = undefined;

    return plainToClass(UserDto, createdUser);
  }

  async login(email: string): Promise<TokenDto> {
    const user = await this.usersService.findOneByEmail(email);
    const payload = { sub: user.id };
    const token = await this.generateToken(payload);
    return { access_token: token };
  }

  async passwordRecover(email: string): Promise<PasswordRecoverDto> {
    const user = await this.usersService.findOneByEmail(email);
    const token = await this.generateToken({ sub: user.id });

    await this.sengridService.createEmail({
      to: user.email,
      subject: `Password Recover`,
      message: `Hello \n use this patch to this url to change you password with your new password`,
      link: `http://${process.env.HOST}${
        process.env.PORT ? `:${process.env.PORT}` : ''
      }/users/passwords/${token}`,
      token,
    });

    return { message: 'Please check your email' };
  }

  async changePassword(
    token: string,
    password: string,
  ): Promise<PasswordRecoverDto> {
    const user = await this.tokenService.findUserId(token);
    const hashedPassword = await this.hashPassword(password);

    await this.usersService.update(user.userId, {
      password: hashedPassword,
    });

    return { message: 'Password changed succesful' };
  }

  private async generateToken(payload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    await this.tokenService.create(token, payload);
    return token;
  }

  private async comparePassword(enteredPassword, dbPassword): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  private async hashPassword(password): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
