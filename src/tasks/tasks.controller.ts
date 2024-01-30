import { jwtConstants } from './../auth/constants';
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
  Header,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TasksDto } from './dto/tasks.dto';
import { Tasks } from './tasks.entity';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiHeader,
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cache, CacheKey } from '@nestjs/cache-manager';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly cacheManager: Cache
  ) {}

  @ApiOperation({
    summary: 'Récupérer une tâche par son ID',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({ status: 200, description: 'Tâche récupérée avec succès' })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Récupérer toutes les tâches',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches récupérées avec succès',
  })
  @ApiBearerAuth()
  @Get()
  findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @ApiOperation({
    summary: "Récupérer toutes les tâches d'un utilisateur",
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches récupérées avec succès',
  })
  @ApiBearerAuth()
  @Get('users/:id')
  async findByUserId(@Param('id') userId: number): Promise<Tasks[]> {
    return this.tasksService.findByUserId(userId);
  }

  @ApiOperation({
    summary: 'Créer une tâche',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }], // Ajout de cette ligne pour spécifier l'authentification Bearer
  })
  @ApiResponse({ status: 201, description: 'Tâche créée avec succès' })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Supprimer une tâche',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 204, description: 'Tâche supprimée avec succès' })
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.cacheManager.del('custom_key');
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

  @ApiOperation({
    summary: 'Modifier une tâche',
    requestBody: {
      content: {
        'application/json': {},
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, description: 'Tâche modifiée avec succès' })
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Tasks> {
    const { title, description, status } = updateTaskDto;
    await this.cacheManager.reset();
    return this.tasksService.updateTask(id, title, description, status);
  }
}
