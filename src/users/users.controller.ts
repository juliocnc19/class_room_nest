import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  DeleteUserDto,
  FindUserDto,
  UpdateUserDto,
} from './dto/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('se llamo');
    return await this.usersService.create(createUserDto);
  }

  @Get('/find/:email')
  async find(@Param('email') findUserDto: FindUserDto) {
    return await this.usersService.find(findUserDto);
  }

  @Get('/findMany')
  async findMany() {
    console.log('se llamo');
    return await this.usersService.findMany();
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    console.log('se llamo');
    return await this.usersService.update(updateUserDto);
  }

  @Post('/authenticate')
  async authenticate(@Body() authenticateUserDto: CreateUserDto) {
    console.log('se llamo');
    return await this.usersService.authenticate(authenticateUserDto);
  }

  @Delete()
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    console.log('se llamo');
    return await this.usersService.delete(deleteUserDto);
  }
}
