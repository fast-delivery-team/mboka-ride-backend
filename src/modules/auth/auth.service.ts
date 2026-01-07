import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

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
