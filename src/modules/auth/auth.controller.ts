import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of users to import',
    type: FileUploadDto,
  })
  @Post('import-many')
  async importMany(@UploadedFile() file: Express.Multer.File) {
    return await this.authService.importMany(file);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() data: RequestResetPasswordDto
  ): Promise<{ message: string }> {
    return await this.authService.requestResetPassword(data);
  }

  @Post('token')
  async checkTokenResetPassword(@Body('token') token: string): Promise<true> {
    await this.authService.checkTokenResetPassword(token);
    return true;
  }

  @Post('reset-password')
  async resetPassword(
    @Body() data: ResetPasswordDto
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(data);
  }
}
