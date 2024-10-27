import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() userCreateInput: Prisma.UserCreateInput) {
    return await this.usersService.create(userCreateInput);
  }

  @Get('/find/:email')
  async find(@Param('email') email: string) {
    return await this.usersService.find(email);
  }

  @Get('/findMany')
  async findMany() {
    return await this.usersService.findMany();
  }
}
