import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';
import { EnvConstant } from 'src/shares/constants';

export const mailConfig: MailerAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>(EnvConstant.MAIL_HOST),
      secure: false,
      auth: {
        user: configService.get<string>(EnvConstant.MAIL_USER),
        pass: configService.get<string>(EnvConstant.MAIL_PASSWORD),
      },
    },
    defaults: {
      from: `"${configService.get<string>(
        EnvConstant.MAIL_FROM_NAME
      )}" <${configService.get<string>(EnvConstant.MAIL_FROM_ADDRESS)}>`,
    },
    template: {
      dir: __dirname + '/../modules/mail/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};
