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
  UpdateUserRoleDto,
} from './dto/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/find/:email')
  async find(@Param('email') email: string) {
    return this.usersService.find(email);
  }

  @Get('/findMany')
  async findMany() {
    return this.usersService.findMany();
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Put("/changeRole")
  async changeRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(updateUserRoleDto);
  }

  @Post('/authenticate')
  async authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto);
  }

  @Delete('/:id')
  async delete(@Param('id') userId: number) {
    return this.usersService.delete(userId);
  }
}
