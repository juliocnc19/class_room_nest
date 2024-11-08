import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dto/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('/:email')
  async find(@Param('email') findUserDto: FindUserDto) {
    return await this.usersService.find(findUserDto);
  }

  @Get('/findMany')
  async findMany() {
    return await this.usersService.findMany();
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto);
  }
}
