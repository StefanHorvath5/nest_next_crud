import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService, SafeUser } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<SafeUser> {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: ExpressRequest): { access_token: string } {
    const user = req.user as SafeUser;
    return this.authService.login(user);
  }
}
