import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenDto } from 'src/tokens/dto/token.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { SignUpData } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
