import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Import 'In' from TypeORM
import { Tasks } from './tasks.entity';
import { TasksDto } from './dto/tasks.dto';
import { Users } from '../users/users.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
    @InjectRepository(Users) // Add this
    private usersRepository: Repository<Users>
  ) {}

  findAll(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }

  async findByUserId(userId: number): Promise<Tasks[]> {
    return this.tasksRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.users', 'users')
      .leftJoinAndSelect('tasks.users', 'all_users') // Add this line to include all user information
      .where('all_users.id = :userId OR tasks.userId = :userId', { userId })
      .getMany();
  }

  private async loadUsersDetails(userIds: number[]): Promise<Users[]> {
    // Assuming Users is your entity representing user details
    return this.usersRepository.find({
      where: { id: In(userIds) },
    });
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

  async add(taskDto: TasksDto): Promise<TasksDto> {
    // Extract the 'users' field from the DTO
    const { users, ...taskData } = taskDto;

    // Create a new task entity based on the extracted data
    const newTask = this.tasksRepository.create({
      ...taskData,
      users: users ? users.map((userId) => ({ id: userId })) : [], // Convert user IDs to Users entities
    });

    // Save the new task to the database
    await this.tasksRepository.save(newTask);

    // Return the DTO representation of the added task
    return taskDto;
  }

  async updateTask(
    id: number,
    newTitle?: string,
    newDescription?: string,
    newStatus?: string,
    newUsers?: number[]
  ): Promise<Tasks> {
    // Find the task to update
    const task = await this.tasksRepository.findOne({ where: { id } });

    // Check if the task exists
    if (!task) {
      throw new NotFoundException(
        `La tâche avec l'ID ${id} n'a pas été trouvée.`
      );
    }

    // Update task properties with new values if provided
    if (newTitle !== undefined) {
      task.title = newTitle;
    }

    if (newDescription !== undefined) {
      task.description = newDescription;
    }

    if (newStatus !== undefined) {
      task.status = newStatus;
    }

    if (newUsers !== undefined) {
      // Ensure that the provided user IDs exist before updating the task
      const existingUsers = await this.tasksRepository.manager.find(Users, {
        // Change here
        where: { id: In(newUsers) }, // Adjust the where condition based on your Users entity
      });

      if (existingUsers.length !== newUsers.length) {
        throw new NotFoundException(
          `One or more user IDs provided do not exist.`
        );
      }

      // Update the task's users field with the new array of user entities
      task.users = existingUsers;
    }

    // Save the changes to the database
    await this.tasksRepository.save(task);

    // Return the updated task
    return task;
  }
}
