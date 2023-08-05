import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(CronService.name);
  }

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.log('Called when the second is 45');
  }
}
