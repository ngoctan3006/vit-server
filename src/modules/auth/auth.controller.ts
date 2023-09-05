import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Position, User } from '@prisma/client';
import { GetUser, Roles } from 'src/shares/decorators';
import { MessageDto, ResponseDto } from 'src/shares/dto';
import { AuthService } from './auth.service';
import {
  ChangePasswordFirstLoginDto,
  CheckTokenDto,
  FileUploadDto,
  IsSendMailDto,
  RefreshTokenDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  ResponseLoginDto,
  SigninDto,
  SignupDto,
} from './dto';
import { FirstLoginGuard, JwtGuard } from './guards';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  async getMe(@GetUser('id') userId: string): Promise<ResponseDto<User>> {
    return { data: await this.authService.getMe(userId) };
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
  async importMany(
    @UploadedFile() file: Express.Multer.File,
    @Query() { isSendMail }: IsSendMailDto
  ) {
    return await this.authService.importMany(file, isSendMail);
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
  ): Promise<ResponseDto<MessageDto>> {
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
  ): Promise<ResponseDto<MessageDto>> {
    return await this.authService.resetPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(FirstLoginGuard)
  @Put('first-login')
  async firstLogin(
    @GetUser('id') id: string,
    @Body() data: ChangePasswordFirstLoginDto
  ): Promise<ResponseDto<MessageDto>> {
    return {
      data: await this.authService.changePasswordInFirstLogin(id, data),
    };
  }
}
