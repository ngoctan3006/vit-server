import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { MailQueueService } from '../mail/services';

@Injectable()
export class CronService {
  constructor(
    private readonly mailQueueService: MailQueueService,
    private readonly userService: UserService
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_7AM)
  // async handleSendMailBirthday() {
  //   const userList = await this.userService.getUserBirthday();
  //   for (const user of userList) {
  //     await this.mailQueueService.addHappyBirthdayMail(user);
  //   }
  // }
}
