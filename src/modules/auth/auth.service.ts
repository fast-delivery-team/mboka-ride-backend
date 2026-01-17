import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { env } from 'src/config/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const { email, phoneNumber } = registerDto;

    const existingEmail = await this.userService.findOneByEmail(email);
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingPhone = await this.userService.findByPhoneNumber(phoneNumber);
    if (existingPhone)
      throw new ConflictException('Phone number already in use');

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload: JwtPayload = { sub: newUser.id, email: newUser.email };

    const token = this.generateJwtToken(payload);

    const userWithoutPassword = { ...newUser, password: undefined };

    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, type: 'access' };
    const tokens = this.generateJwtToken(payload);

    const userWithoutPassword = { ...user, password: undefined };

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: env.JWT_ACCESS_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: JwtPayload = { sub: user.id, email: user.email, type: 'access' };
      const tokens = await this.generateJwtToken(newPayload);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private generateJwtToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
