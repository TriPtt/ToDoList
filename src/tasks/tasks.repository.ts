import { EntityRepository, Repository } from 'typeorm';
import { Tasks } from './tasks.entity';

@EntityRepository(Tasks)
export class TasksRepository extends Repository<Tasks> {}
