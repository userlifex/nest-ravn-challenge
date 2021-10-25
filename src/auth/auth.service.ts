import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpData } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
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

  async signup(signUpData: SignUpData) {
    const hashedPassword = await this.hashPassword(signUpData.password);

    const createdUser = await this.usersService.create({
      ...signUpData,
      password: hashedPassword,
    });
    createdUser.password = undefined;

    const token = await this.generateToken(createdUser);

    return { user: createdUser, token };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
