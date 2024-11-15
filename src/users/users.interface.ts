import { User } from '@prisma/client';
import {
  AuthenticateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/users.dto';

export interface Users {
  create(data: CreateUserDto): Promise<User>;
  find(email: string): Promise<User>;
  findMany(): Promise<User[]>;
  update(user: UpdateUserDto): Promise<User>;
  authenticate(user: AuthenticateUserDto): Promise<User>;
  delete(user: number): Promise<User>;
}
