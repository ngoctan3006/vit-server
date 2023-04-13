import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const prefix = configService.get<string>('PREFIX');
  const port = configService.get('PORT');

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME'))
    .setDescription('VIT server api documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port || 2109);
}
bootstrap();
