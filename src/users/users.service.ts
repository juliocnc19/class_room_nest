import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Users } from './users.interface';
import {
  AuthenticateUserDto,
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
} from './dto/users.dto';

@Injectable()
export class UsersService implements Users {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      const validationUser = await this.prismaService.user.findMany({
        where: {
          OR: [{ email: user.email }, { user_name: user.user_name }],
        },
      });

      if (validationUser)
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            message: 'User already exists',
            data: {},
          },
          HttpStatus.CONFLICT,
        );

      return this.prismaService.user.create({ data: user });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async find(email: string): Promise<User> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });

      if (!user)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'User not exists',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return user;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMany(): Promise<User[]> {
    try {
      return this.prismaService.user.findMany();
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(user: UpdateUserDto): Promise<User> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!userFound)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'User not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return this.prismaService.user.update({
        where: { id: user.id },
        data: user,
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authenticate(user: AuthenticateUserDto): Promise<User> {
    const userFind = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!userFind) {
      throw new UnauthorizedException('User not exists');
    }

    const isPasswordValid = user.password === userFind.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    return userFind;
  }

  async delete(userId: number): Promise<User> {
    try {
      const userFind = await this.prismaService.user.delete({
        where: { id: userId },
      });

      if (!userFind)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'User not exists',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return userFind;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
