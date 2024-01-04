import {
  Controller,
  Get,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Post,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Tasks } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @Post()
  async create(@Body() taskData: Partial<Tasks>): Promise<Tasks> {
    try {
      return await this.tasksService.add(taskData);
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur interne est survenue.'
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.tasksService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Une erreur interne est survenue.'
        );
      }
    }
  }
}
