import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';

import { LocalAuthGuard } from './guards/local-auth/local-auth.guard.js';
import { User } from '../users/entities/user.entity.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User) {
    const token = this.authService.login(user);
    return token;
  }
}
