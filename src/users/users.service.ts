import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Users } from './users.interface';
import { CreateUserDto, FindUserDto } from './dto/users.dto';

@Injectable()
export class UsersService implements Users {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data: user });
  }

  async find(findUserDto: FindUserDto): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email: findUserDto.email },
    });
  }

  async findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
}
