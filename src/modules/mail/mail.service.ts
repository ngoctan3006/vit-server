import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { WelcomeDto } from './dto/welcome.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

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
      },
    });
    console.log(`Mail sent to ${email} successfully`);
  }

  async sendResetPasswordMail(resetPasswordData: ResetPasswordDto) {
    const { email } = resetPasswordData;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      template: './reset-password',
      context: resetPasswordData,
    });
    console.log(`Mail sent to ${email} successfully`);
  }
}
