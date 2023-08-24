import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, Roles } from 'src/shares/decorators';
import { ResponseDto } from 'src/shares/dto';
import { Position } from 'src/shares/enums';
import { User } from '../user/entities';
import { AuthService } from './auth.service';
import { ResponseLoginDto, SigninDto, SignupDto } from './dto';
import { JwtGuard } from './guards';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  async getMe(@GetUser('id') userId: string): Promise<ResponseDto<User>> {
    return await this.authService.getMe(userId);
  }

  @Post('signin')
  async signin(
    @Body() signinData: SigninDto
  ): Promise<ResponseDto<ResponseLoginDto>> {
    return { data: await this.authService.signin(signinData) };
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

  // @Roles(
  //   Position.ADMIN,
  //   Position.DOI_TRUONG,
  //   Position.DOI_PHO,
  //   Position.TRUONG_HANH_CHINH
  // )
  // @ApiBearerAuth()
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'List of users to import',
  //   type: FileUploadDto,
  // })
  // @Post('import-many')
  // async importMany(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Query() { isSendMail }: IsSendMailDto
  // ) {
  //   return await this.authService.importMany(file, isSendMail);
  // }

  // @Post('refresh-token')
  // async refreshToken(
  //   @Body() { refreshToken }: RefreshTokenDto
  // ): Promise<ResponseDto<{ accessToken: string }>> {
  //   return await this.authService.refreshToken(refreshToken);
  // }

  // @Post('request-reset-password')
  // async requestResetPassword(
  //   @Body() data: RequestResetPasswordDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   return await this.authService.requestResetPassword(data);
  // }

  // @Post('token')
  // async checkTokenResetPassword(
  //   @Body() { token }: CheckTokenDto
  // ): Promise<ResponseDto<true>> {
  //   await this.authService.checkTokenResetPassword(token);
  //   return { data: true };
  // }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body() data: ResetPasswordDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   return await this.authService.resetPassword(data);
  // }

  // @ApiBearerAuth()
  // @UseGuards(FirstLoginGuard)
  // @Put('first-login')
  // async firstLogin(
  //   @GetUser('id') id: number,
  //   @Body() data: ChangePasswordFirstLoginDto
  // ): Promise<ResponseDto<MessageDto>> {
  //   return {
  //     data: await this.authService.changePasswordInFirstLogin(id, data),
  //   };
  // }
}
