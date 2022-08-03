import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const APP_MAIN_LOGGER = new Logger('APP_MAIN');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get('API_PREFIX');
  app.setGlobalPrefix(apiPrefix);
  const config = new DocumentBuilder()
    .setTitle('Tasks')
    .setDescription('Tasks Api')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  const apiPort = configService.get('API_PORT');
  await app.listen(apiPort, ()=> {
    APP_MAIN_LOGGER.log(`App is listening on port: ${apiPort}`)
  });
}
bootstrap();
