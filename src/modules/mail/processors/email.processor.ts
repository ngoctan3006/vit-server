import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ResetPasswordDto, WelcomeDto } from '../dto';
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
}
