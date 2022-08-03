import { Body, ConflictException, Controller, Get, InternalServerErrorException, Logger, Post, Query } from '@nestjs/common';
import { TaskService, TaskServiceErrors } from '../services/task.service';
import { TaskCreate, TaskResponse } from '../types/task.type';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

const APP_MAIN_LOGGER = new Logger('TASKS_CONTROLLER');

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TaskService) {}

    @ApiQuery({ name: 'quantity', type: Number, required: false, description: 'default is 3' })
    @ApiResponse({
        type: [TaskResponse]
    })
    @Get()
    getTasks(@Query('quantity') quantity) {
        return this.taskService.generateRandomTaks(quantity);
    }

    @ApiResponse({
        type: TaskResponse,
        
    })
    @ApiBody({
        type: TaskCreate,
        description: 'Title should be unique, otherwise app will return an error'
    })
    @Post()
    createTask(@Body() task: TaskCreate) {
        return this.taskService.createTask(task.title).pipe(
            catchError((e: TaskServiceErrors)=> {
                if (e === 'DUPLICATED_TASK_TITLE') {
                    return throwError(()=> new ConflictException(e));
                }
                APP_MAIN_LOGGER.error(e);
                return throwError(()=> new InternalServerErrorException())
            })
        )
    }
}
