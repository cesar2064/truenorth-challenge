import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { concatMap, forkJoin, from, map, Observable, of, throwError } from 'rxjs';
import { Task, TaskDocument } from '../types/task.type';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export type TaskServiceErrors = 'DUPLICATED_TASK_TITLE';

@Injectable()
export class TaskService {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) {}

    private getRandomTitles(quantity: number) {
        return this.httpService.get<string[]>('https://lorem-faker.vercel.app/api', { params: {quantity} }).pipe(
            map((response)=> response.data)
        );
    }

    private getUniqueRandomTitles(quantity: number = 3) {
        return this.getRandomTitles(quantity).pipe(
            concatMap((titles)=> forkJoin(titles.map((title)=> this.certifyUniqueName(title))))
        )
    }

    private certifyUniqueName(title: string): Observable<string> {
        return from(this.taskModel.findOne({ title })).pipe(
            concatMap((foundValue)=> {
                if (foundValue) {
                    return this.getRandomTitleAndCertify()
                }
                return of(title)
            })
        )
    }

    private getRandomTitleAndCertify() {
        return this.getRandomTitles(1).pipe(
            concatMap((titles)=> this.certifyUniqueName(titles[0]))
        )
    }

    generateRandomTaks(quantity: number = 3) {
        return this.getUniqueRandomTitles(quantity).pipe(
            concatMap((names)=> from(this.taskModel.insertMany(names.map((name)=>({
                title: name,
                uuid: uuidv4()
            })))))
        )
    }

    createTask(title: string) {
        return from(this.taskModel.findOne({ title })).pipe(
            concatMap((foundValue)=> {
                if (!foundValue) {
                    return new this.taskModel({
                        title,
                        uuid: uuidv4()
                    }).save()
                }
                return throwError(()=> 'DUPLICATED_TASK_TITLE' as TaskServiceErrors)
            })
        )
    }

}
