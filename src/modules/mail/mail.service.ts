import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WelcomeDto } from './dto/welcome.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(welcomeData: WelcomeDto) {
    try {
      await this.mailerService.sendMail({
        to: welcomeData.email,
        subject: 'Chào mừng bạn đã đến với đại gia đình VIT',
        template: './welcome',
        context: {
          name: welcomeData.name,
          username: welcomeData.username,
          password: welcomeData.password,
        },
      });
      console.log('Mail sent successfully');
    } catch (error) {
      console.log(error);
    }
  }
}
