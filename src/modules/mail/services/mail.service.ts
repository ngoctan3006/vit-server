import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConstant } from 'src/shares/constants';
import { ResetPasswordDto, WelcomeDto } from '../dto';

@Injectable()
export class MailService {
  private readonly webUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {
    this.webUrl = this.configService.get(EnvConstant.CLIENT_URL);
  }

  async sendWelcomeMail(welcomeData: WelcomeDto) {
    const { email, name, username, password } = welcomeData;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Chào mừng bạn đã đến với Đại gia đình VIT',
      template: './welcome',
      context: {
        name,
        username,
        password,
        loginUrl: `${this.webUrl}/login`,
      },
    });
    console.log(`Mail sent to ${email} successfully`);
  }

  async sendResetPasswordMail(data: ResetPasswordDto) {
    const { email } = data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      template: './reset-password',
      context: data,
    });
    console.log(`Mail sent to ${email} successfully`);
  }
}
