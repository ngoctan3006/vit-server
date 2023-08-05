import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { HappyBirthdayDto, ResetPasswordDto, WelcomeDto } from '../dto';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('send-mail') private readonly sendMail: Queue) {}

  async addWelcomeMail(welcomeData: WelcomeDto) {
    await this.sendMail.add('welcome', welcomeData, {
      removeOnComplete: true,
    });
  }

  async addResetPasswordMail(data: ResetPasswordDto) {
    await this.sendMail.add('reset-password', data, {
      removeOnComplete: true,
    });
  }

  async addHappyBirthdayMail(data: HappyBirthdayDto) {
    await this.sendMail.add('happy-birthday', data, {
      removeOnComplete: true,
    });
  }
}
