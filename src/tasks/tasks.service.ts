import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>
  ) {}

  findAll(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }

  findOne(id: number): Promise<Tasks | null> {
    return this.tasksRepository.findOneBy({ id });
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

  async add(taskData: Partial<Tasks>): Promise<Tasks> {
    const newTask = this.tasksRepository.create(taskData);
    return await this.tasksRepository.save(newTask);
  }
}
