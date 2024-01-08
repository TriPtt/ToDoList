import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';
import { TasksDto } from './dto/tasks.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  findAll(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }

  async findOneTaskById(id: number): Promise<Tasks | null> {
    return await this.tasksRepository.findOne({ where: { id } });
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

  async add(taskDto: TasksDto, userEmail: string): Promise<Tasks> {
    // Vérifiez si la chaîne ressemble à un e-mail
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    // Recherchez l'utilisateur par e-mail
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    const task = new Tasks();
    task.title = taskDto.title;
    task.description = taskDto.description;
    task.status = taskDto.status;
    task.date = taskDto.date;
    task.user = user;

    return await this.tasksRepository.save(task);
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
