import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Users } from './users.interface';

@Injectable()
export class UsersService implements Users {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    return this.prismaService.user.create({ data: user });
  }

  async find(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
}
