import { User } from '@prisma/client';
import {
  AuthenticateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/users.dto';
import { ApiResponse } from 'src/utils/responseHttpUtils';

export interface Users {
  create(data: CreateUserDto): Promise<ApiResponse<User>> ;
  find(email: string): Promise<ApiResponse<User>>;
  findMany(): Promise<ApiResponse<User[]>>;
  update(user: UpdateUserDto): Promise<ApiResponse<User>>;
  authenticate(user: AuthenticateUserDto): Promise<ApiResponse<User>>;
  delete(user: number): Promise<ApiResponse<User>>;
}
