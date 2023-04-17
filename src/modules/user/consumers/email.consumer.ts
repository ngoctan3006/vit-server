import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WelcomeDto } from 'src/modules/mail/dto/welcome.dto';
import { MailService } from './../../mail/mail.service';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private readonly mailService: MailService) {}

  @Process('welcome')
  async welcomeEmail(job: Job<WelcomeDto>) {
    await this.mailService.sendWelcomeMail(job.data);
  }
}
