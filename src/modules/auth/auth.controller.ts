import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './strategy/jwt-refresh.guard';
import { RefreshTokenDto } from './dto/refresh.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Throttle({ default: { ttl: 60000, limit: 2 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('activate')
  activateAccount(@Body() body: { token: string }){
    return this.authService.activateAccount(body.token)
  }
}
