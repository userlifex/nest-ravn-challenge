import { User } from '.prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SengridService } from 'src/common/sengrid/sengrid.service';
import { TokenDto } from 'src/tokens/dto/token.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/services/users.service';
import { SignUpData } from '../dto/request/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sengridService: SengridService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    user.password = undefined;
    return user;
  }

  async signup(signUpData: SignUpData): Promise<User> {
    const hashedPassword = await this.hashPassword(signUpData.password);

    const createdUser = await this.usersService.create({
      ...signUpData,
      password: hashedPassword,
    });
    createdUser.password = undefined;

    return createdUser;
  }

  async login(user: User): Promise<TokenDto> {
    const payload = { sub: user.id };
    const token = await this.generateToken(payload);
    return { access_token: token };
  }

  async passwordRecover(email: string): Promise<string> {
    const user = await this.usersService.findOneByEmail(email);
    const token = await this.generateToken({ sub: user.id });

    await this.sengridService.createEmail({
      to: user.email,
      subject: `Password Recover`,
      message: `Hello ${user.name} use patch to this url to change you password with your new password`,
      link: `http://${process.env.HOST}${
        process.env.PORT ? `:${process.env.PORT}` : ''
      }/users/passwords/${token}`,
      token,
    });

    return token;
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
