import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TaskService } from './services/task.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './types/task.type';

@Module({
  controllers: [TasksController],
  providers: [TaskService],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    HttpModule
  ]
})
export class TaskModule {}
