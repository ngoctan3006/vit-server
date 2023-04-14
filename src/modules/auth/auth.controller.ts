import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Roles(Position.MEMBER, Position.ADMIN, Position.CHIEF)
  async signin(@Body() signinData: SigninDto) {
    return 'signin';
  }

  @Post('signup')
  @Roles(Position.ADMIN)
  async signup(@Body() signupData: SignupDto) {
    return await this.authService.signup(signupData);
  }
}
