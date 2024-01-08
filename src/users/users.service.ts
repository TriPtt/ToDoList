import { UsersDto } from './dto/users.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  async newUser(user: UsersDto): Promise<Users> {
    const saltRounds = 10; // Nombre de rounds pour générer le sel

    // Utilisez bcrypt pour hacher le mot de passe avec un sel
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Remplacez le mot de passe par le mot de passe haché
    user.password = hashedPassword;
    return await this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<Users | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserAndTasksByEmail(
    email: string,
    relations: string[]
  ): Promise<Users | undefined> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: relations,
    });
  }

  async deleteUser(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      await this.usersRepository.remove(user);
    } else {
      throw new Error(`User with email ${email} not found`);
    }
  }

  async updateUser(
    email: string,
    updateUserDto: Partial<UsersDto>
  ): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Mettre à jour les propriétés de l'utilisateur
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }
}
