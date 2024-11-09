import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Users } from './users.interface';
import {
  AuthenticateUserDto,
  CreateUserDto,
  DeleteUserDto,
  FindUserDto,
  UpdateUserDto,
} from './dto/users.dto';

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

  async update(user: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async authenticate(user: AuthenticateUserDto): Promise<User> {
    const userFind = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = user.password === userFind.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return userFind;
  }

  async delete(user: DeleteUserDto): Promise<User> {
    return this.prismaService.user.delete({
      where: { id: user.id },
    });
  }
}
