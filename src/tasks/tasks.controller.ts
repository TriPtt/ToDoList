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
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksDto } from './dto/tasks.dto';
import { Tasks } from './tasks.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('tasks')
@UseInterceptors(CacheInterceptor)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  @CacheTTL(600) // Spécifiez le temps de vie du cache (en secondes)
  async findOneTaskById(@Param('id') id: number): Promise<Tasks> {
    const task = await this.tasksService.findOneTaskById(id);
    if (!task) {
      throw new NotFoundException(
        `La tâche avec l'id ${id} n'a pas été trouvée`
      );
    }
    return task;
  }

  @Get()
  @CacheTTL(600) // Spécifiez le temps de vie du cache (en secondes)
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @Get('users/:id')
  async findByUserId(@Param('id') userId: number): Promise<Tasks[]> {
    return this.tasksService.findByUserId(userId);
  }

  @Post()
  @CacheTTL(600) // Spécifiez le temps de vie du cache (en secondes)
  async create(@Request() req, @Body() taskDto: TasksDto): Promise<TasksDto> {
    try {
      const userId = req.user.sub;
      taskDto.userId = userId;
      return await this.tasksService.add(taskDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur interne est survenue lors de la création.'
      );
    }
  }

  @Delete(':id')
  @CacheTTL(600) // Spécifiez le temps de vie du cache (en secondes)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.tasksService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Une erreur interne est survenue lors de la supression.'
        );
      }
    }
  }

  @Patch(':id')
  @CacheTTL(600) // Spécifiez le temps de vie du cache (en secondes)
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Tasks> {
    const { title, description, status } = updateTaskDto;
    return this.tasksService.updateTask(id, title, description, status);
  }
}
