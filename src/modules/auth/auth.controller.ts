import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Position, User } from '@prisma/client';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { Roles } from 'src/shares/decorators/roles.decorator';
import { ResponseDto } from 'src/shares/dto/response.dto';
import { AuthService } from './auth.service';
import { ChangePasswordFirstLoginDto } from './dto/change-password-first-login.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { FirstLoginGuard } from './guards/first-login.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  async getMe(@GetUser('id') userId: number): Promise<ResponseDto<User>> {
    return await this.authService.getMe(userId);
  }

  @Post('signin')
  async signin(
    @Body() signinData: SigninDto
  ): Promise<ResponseDto<ResponseLoginDto>> {
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
  async signup(@Body() signupData: SignupDto): Promise<ResponseDto<User>> {
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
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto
  ): Promise<ResponseDto<{ accessToken: string }>> {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() data: RequestResetPasswordDto
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.authService.requestResetPassword(data);
  }

  @Post('token')
  async checkTokenResetPassword(
    @Body() { token }: CheckTokenDto
  ): Promise<ResponseDto<true>> {
    await this.authService.checkTokenResetPassword(token);
    return { data: true };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() data: ResetPasswordDto
  ): Promise<ResponseDto<{ message: string }>> {
    return await this.authService.resetPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(FirstLoginGuard)
  @Put('first-login')
  async firstLogin(
    @GetUser('id') id: number,
    @Body() data: ChangePasswordFirstLoginDto
  ): Promise<{ message: string }> {
    return await this.authService.changePasswordInFirstLogin(id, data);
  }
}
