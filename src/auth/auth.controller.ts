import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken.token);
  }
}
