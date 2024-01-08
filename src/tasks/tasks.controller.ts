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
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksDto } from './dto/tasks.dto';
import { Tasks } from './tasks.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  async findOneTaskById(@Param('id') id: number): Promise<Tasks> {
    const task = await this.tasksService.findOneTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  @Get()
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @Post()
  async create(@Body() taskDto: TasksDto): Promise<TasksDto> {
    try {
      const userEmail = ''; // Replace with the actual user email
      return await this.tasksService.add(taskDto, userEmail);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur interne est survenue.'
      );
    }
  }

  @Delete(':id')
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

  @Patch(':id')
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Tasks> {
    const { title, description, status } = updateTaskDto;
    return this.tasksService.updateTask(id, title, description, status);
  }
}
