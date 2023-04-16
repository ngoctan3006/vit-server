import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  async signin(@Body() signinData: SigninDto) {
    return await this.authService.signin(signinData);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return await this.authService.signup(signupData);
  }

  @Roles(
    Position.ADMIN,
    Position.DOI_TRUONG,
    Position.DOI_PHO,
    Position.TRUONG_HANH_CHINH
  )
  @Post('import-many')
  @UseInterceptors(FileInterceptor('file'))
  async importMany(@UploadedFile() file: Express.Multer.File) {
    return await this.authService.importMany(file);
  }
}
