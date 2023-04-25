import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EnvConstant } from 'src/shares/constants/env.constant';

export const mailConfig = {
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
      from: `${configService.get<string>(
        EnvConstant.MAIL_FROM_NAME
      )} <${configService.get<string>(EnvConstant.MAIL_FROM_ADDRESS)}>`,
    },
    template: {
      dir: join(__dirname + '/../modules/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};
