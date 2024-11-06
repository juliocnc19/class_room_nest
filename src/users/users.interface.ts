import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto } from './dto/users.dto';

export interface Users {
  create(data: CreateUserDto): Promise<User>;
  find(email: FindUserDto): Promise<User>;
  findMany(): Promise<User[]>;
}
