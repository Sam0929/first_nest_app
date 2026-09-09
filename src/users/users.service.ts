import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
     const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }

    
    const saltOrRounds = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      passwordHash: passwordHash,
    });

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {

    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    if(!user){
      throw new NotFoundException(
        'User not found',
      );
    }
  
    return user;
  }

  async findByEmail(email: string){

    const user = await this.usersRepository.findOne({
      where: { 
        email: email
      }
    })

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const userEmailAlreadyUsed =
        await this.usersRepository.findOne({
          where: {
            email: updateUserDto.email,
          },
        });

      if (
        userEmailAlreadyUsed &&
        userEmailAlreadyUsed.id !== id
      ) {
        throw new ConflictException(
          'Email already registered',
        );
      }
    }

    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      const saltOrRounds = await bcrypt.genSalt();
      user.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    const updatedUser =
      await this.usersRepository.save(user);

    return updatedUser;
  }

  async remove(id: number): Promise<void> {

    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }
}

