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

  async updateTask(
    id: number,
    newTitle?: string,
    newDescription?: string,
    newStatus?: string
  ): Promise<Tasks> {
    // Recherchez la tâche à mettre à jour
    const task = await this.tasksRepository.findOne({ where: { id } });

    // Vérifiez si la tâche existe
    if (!task) {
      throw new NotFoundException(
        `La tâche avec l'ID ${id} n'a pas été trouvée.`
      );
    }

    // Mettez à jour les propriétés de la tâche avec les nouvelles valeurs si elles sont fournies
    if (newTitle !== undefined) {
      task.title = newTitle;
    }

    if (newDescription !== undefined) {
      task.description = newDescription;
    }

    if (newStatus !== undefined) {
      task.status = newStatus;
    }

    // Enregistrez les modifications dans la base de données
    await this.tasksRepository.save(task);

    // Renvoyez la tâche mise à jour
    return task;
  }
}
