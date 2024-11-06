import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, FindUserDto } from './dto/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('/find/:email')
  async find(@Param('email') findUserDto: FindUserDto) {
    return await this.usersService.find(findUserDto);
  }

  @Get('/findMany')
  async findMany() {
    return await this.usersService.findMany();
  }
}
