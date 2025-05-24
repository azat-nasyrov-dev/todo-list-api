import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  public async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(dto);
  }
}
