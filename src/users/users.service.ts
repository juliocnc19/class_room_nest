import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { Users } from './users.interface';

@Injectable()
export class UsersService implements Users {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async find(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
}
