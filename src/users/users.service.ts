import { UsersDto } from './dto/users.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  async newUser(user: UsersDto): Promise<Users> {
    return await this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<Users | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async deleteUser(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      await this.usersRepository.remove(user);
    } else {
      throw new Error(`User with email ${email} not found`);
    }
  }
}
