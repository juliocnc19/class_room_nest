import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticateUserDto,
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
} from './dto/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      code: HttpStatus.CREATED,
      message: 'User created',
      data: user,
    };
  }

  @Get('/find/:email')
  async find(@Param('email') findUserDto: string) {
    const user = await this.usersService.find(findUserDto);
    return {
      code: HttpStatus.OK,
      message: 'User found',
      data: user,
    };
  }

  @Get('/findMany')
  async findMany() {
    const users = await this.usersService.findMany();
    return {
      code: HttpStatus.OK,
      message: 'Users found',
      data: users,
    };
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(updateUserDto);
    return {
      code: HttpStatus.OK,
      message: 'Users updated',
      data: user,
    };
  }

  @Post('/authenticate')
  async authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    const user = await this.usersService.authenticate(authenticateUserDto);
    return {
      code: HttpStatus.OK,
      message: 'Authenticated',
      data: user,
    };
  }

  @Delete()
  async delete(@Body() deleteUserDto: number) {
    const user = await this.usersService.delete(deleteUserDto);
    return {
      code: HttpStatus.OK,
      message: 'User deleted',
      data: user,
    };
  }
}
