import { User, Prisma } from '@prisma/client';

export interface Users {
  create(data: User): Promise<User>;
  find(email: string): Promise<User>;
  findMany(): Promise<User[]>;
}
