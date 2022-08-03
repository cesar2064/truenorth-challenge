import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({
    unique: true,
    type: mongoose.Schema.Types.String
  })
  title: string;

  @Prop({
    unique: true,
    type: mongoose.Schema.Types.String
  })
  uuid: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

export class TaskCreate {
    @ApiProperty({ type: String })
    @IsString()
    title: string;
}

export class TaskResponse {
    @ApiProperty({ type: String })
    title: string;
    @ApiProperty({ type: String })
    uuid: string;
}