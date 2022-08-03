import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService)=> ({
        uri: configService.get('MONGO_URL')
      }),
      inject: [ConfigService]
    }),
    TaskModule
  ],
})
export class AppModule {}
