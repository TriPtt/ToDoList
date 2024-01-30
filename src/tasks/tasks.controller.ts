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
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TasksDto } from './dto/tasks.dto';
import { Tasks } from './tasks.entity';
import { ApiBody, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Récupérer une tâche par son ID' })
  @ApiResponse({ status: 200, description: 'Tâche récupérée avec succès' })
  @ApiBody({ type: Number })
  @Get(':id')
  async findOneTaskById(@Param('id') id: number): Promise<Tasks> {
    const task = await this.tasksService.findOneTaskById(id);
    if (!task) {
      throw new NotFoundException(
        `La tâche avec l'id ${id} n'a pas été trouvée`
      );
    }
    return task;
  }

  @ApiOperation({ summary: 'Récupérer toutes les tâches' })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches récupérées avec succès',
  })
  @ApiBody({ type: TasksDto })
  @Get()
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @ApiOperation({ summary: 'Ajouter une tâche' })
  @ApiResponse({ status: 201, description: 'Tâche ajouté avec succès' })
  @ApiBody({ type: TasksDto })
  @Post()
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

  @ApiOperation({ summary: 'Supprimer une tâche' })
  @ApiResponse({ status: 204, description: 'Tâche supprimée avec succès' })
  @ApiBody({ type: Number })
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
          'Une erreur interne est survenue lors de la supression.'
        );
      }
    }
  }

  @ApiOperation({ summary: 'Modifier une tâche' })
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
