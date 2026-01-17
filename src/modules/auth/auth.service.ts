import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { env } from 'src/config/env';
import type { StringValue } from 'ms';



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

    const token = await this.generateTokens(payload);
    const userWithoutPassword = { ...newUser, password: undefined };

    return { user: userWithoutPassword, ...token };
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
    const tokens = await this.generateTokens(payload);

    const userWithoutPassword = { ...user, password: null };

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: env.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: JwtPayload = { sub: user.id, email: user.email, type: 'access' };
      const tokens = await this.generateTokens(newPayload);

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

  private async generateTokens(payload: JwtPayload) {
    const accessTokenPayload: Omit<JwtPayload, 'type'> & { type: 'access' } = {
      ...payload,
      type: 'access',
    };
  
    const refreshTokenPayload: Omit<JwtPayload, 'type'> & { type: 'refresh' } = {
      ...payload,
      type: 'refresh',
    };
  
    const accessExpiresIn: StringValue | number =
      (env.JWT_ACCESS_EXPIRES_IN as StringValue) ?? '15m';
  
    const refreshExpiresIn: StringValue | number =
      (env.JWT_REFRESH_EXPIRES_IN as StringValue) ?? '7d';
  
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: refreshExpiresIn,
      }),
    ]);
  
    return { accessToken, refreshToken };
  }
  
}
