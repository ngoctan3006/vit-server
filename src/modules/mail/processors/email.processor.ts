import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { HappyBirthdayDto, ResetPasswordDto, WelcomeDto } from '../dto';
import { MailService } from '../services';

@Processor('send-mail')
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('welcome')
  async welcomeEmail(job: Job<WelcomeDto>) {
    await this.mailService.sendWelcomeMail(job.data);
  }

  @Process('reset-password')
  async resetPasswordEmail(job: Job<ResetPasswordDto>) {
    await this.mailService.sendResetPasswordMail(job.data);
  }

  @Process('happy-birthday')
  async happyBirthdayMail(job: Job<HappyBirthdayDto>) {
    await this.mailService.sendHappyBirthdayMail(job.data);
  }
}
