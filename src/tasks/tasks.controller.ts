import {
  Controller,
  Get,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksDto } from './dto/tasks.dto';
import { Tasks } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findTasksByUserId(@Query('idUser') idUser: number): Promise<Tasks> {
    const user = await this.tasksService.findTaskByIdUser(idUser);
    if (!user) {
      throw new NotFoundException(`User with idUser ${idUser} not found`);
    }
    return user;
  }

  @Get()
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @Post('create')
  async create(@Body() taskDto: TasksDto): Promise<TasksDto> {
    try {
      return await this.tasksService.add(taskDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur interne est survenue.'
      );
    }
  }

  @Delete('/delete/id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.tasksService.remove(id);
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
