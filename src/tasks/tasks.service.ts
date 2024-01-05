import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';
import { TasksDto } from './dto/tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>
  ) {}

  findAll(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }

  async findTaskByIdUser(idUser: number): Promise<Tasks | null> {
    return await this.tasksRepository.findOne({ where: { idUser } });
  }

  async remove(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(
        `La tâche avec l'ID ${id} n'a pas été trouvée.`
      );
    }

    await this.tasksRepository.remove(task);
  }

  async add(taskDto: TasksDto): Promise<TasksDto> {
    return await this.tasksRepository.save(taskDto);
  }
}
