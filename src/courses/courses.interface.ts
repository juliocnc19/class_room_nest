import { Course, User, Prisma } from '@prisma/client';

export interface Courses {
  create(course: Prisma.CourseCreateInput): Promise<Course>;
  findOne(id: Prisma.CourseWhereUniqueInput): Promise<Course | null>;
  findMany(ownerId: number): Promise<Array<Course>>;
  delete(id: Prisma.CourseWhereUniqueInput): Promise<Course>;
  update(id: number, course: Prisma.CourseUpdateInput): Promise<Course>;
  findUserOfCourse(course_id: Prisma.CourseWhereUniqueInput): Promise<Course>;
  joinToCourse(id: number, token: string): Promise<Course>;
  delteUserOfCourse(idUser: number, idCourse: number): Promise<User>;
}
