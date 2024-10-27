import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Courses } from './courses.interface';
import { Prisma, Course, User } from '@prisma/client';

@Injectable()
export class CoursesService implements Courses {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: Prisma.CourseCreateInput): Promise<Course> {
    return await this.prisma.course.create({ data: course });
  }

  async findOne(id: Prisma.CourseWhereUniqueInput): Promise<Course | null> {
    return await this.prisma.course.findUnique({ where: id });
  }

  async findMany(ownerId: number): Promise<Array<Course>> {
    return await this.prisma.course.findMany({ where: { ownerId } });
  }

  async delete(id: Prisma.CourseWhereUniqueInput): Promise<Course> {
    return await this.prisma.course.delete({ where: id });
  }

  async update(id: number, course: Prisma.CourseUpdateInput): Promise<Course> {
    return await this.prisma.course.update({
      where: { id },
      data: course,
    });
  }

  async findUserOfCourse(
    course_id: Prisma.CourseWhereUniqueInput,
  ): Promise<Course> {
    return await this.prisma.course.findUnique({ where: course_id });
  }

  async joinToCourse(id: number, token: string): Promise<Course> {
    return await this.prisma.course.update({
      where: { id },
      data: { token },
    });
  }

  async delteUserOfCourse(idUser: number, idCourse: number): Promise<User> {
    return await this.prisma.user.update({
      where: { id: idUser },
      data: { courses: { disconnect: [{ id: idCourse }] } },
    });
  }
}
