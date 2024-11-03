import { User, Prisma } from '@prisma/client';

export interface Users {
  create(data: Prisma.UserCreateInput): Promise<User>;
  find(email: string): Promise<User>;
  findMany(): Promise<User[]>;
}
