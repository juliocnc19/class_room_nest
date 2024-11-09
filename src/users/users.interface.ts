import { User } from '@prisma/client';
import {
  AuthenticateUserDto,
  CreateUserDto,
  DeleteUserDto,
  FindUserDto,
  UpdateUserDto,
} from './dto/users.dto';

export interface Users {
  create(data: CreateUserDto): Promise<User>;
  find(email: FindUserDto): Promise<User>;
  findMany(): Promise<User[]>;
  update(user: UpdateUserDto): Promise<User>;
  authenticate(user: AuthenticateUserDto): Promise<User>;
  delete(user: DeleteUserDto): Promise<User>;
}
