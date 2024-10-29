import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() userCreateInput: User) {
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
