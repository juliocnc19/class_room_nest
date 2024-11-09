import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Courses } from './courses.interface';
import { Course, User } from '@prisma/client';
import {
  ChangeStatusCourseDto,
  CreateCourseDto,
  DeleteCourseDto,
  FindManyCourseDto,
  FindOneCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

@Injectable()
export class CoursesService implements Courses {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.prisma.course.create({ data: createCourseDto });
  }

  async findOne(findOneCourseDto: FindOneCourseDto): Promise<Course | null> {
    return await this.prisma.course.findUnique({
      where: { id: findOneCourseDto.id },
    });
  }

  async findMany(findManyCourseDto: FindManyCourseDto): Promise<Array<Course>> {
    return await this.prisma.course.findMany({
      where: { ownerId: findManyCourseDto.ownerId },
    });
  }

  async delete(deleteCourseId: FindOneCourseDto): Promise<Course> {
    return await this.prisma.course.delete({
      where: { id: deleteCourseId.id },
    });
  }

  async update(updateCourseDto: UpdateCourseDto): Promise<Course> {
    return await this.prisma.course.update({
      where: { id: updateCourseDto.id },
      data: updateCourseDto,
    });
  }

  async findUserOfCourse(findOneCourseDto: FindOneCourseDto): Promise<Course> {
    return await this.prisma.course.findUnique({
      where: { id: findOneCourseDto.id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        area: {
          select: {
            area: true,
          },
        },
      },
    });
  }

  async joinToCourse(joinUserCourseDto: JoinUserCourseDto): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: {
        token: joinUserCourseDto.token,
      },
    });
    const jointed = await this.prisma.courseEnrollment.create({
      data: {
        userId: joinUserCourseDto.id,
        courseId: course.id,
      },
    });

    if (jointed) return course;

    return null;
  }

  async delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id: deleteCourseDto.idUser },
      data: { courses: { disconnect: [{ id: deleteCourseDto.idCourse }] } },
    });
  }

  async changeStatus(changeStatusCourseDto: ChangeStatusCourseDto) {
    return await this.prisma.course.update({
      where: { id: changeStatusCourseDto.id },
      data: { verified: changeStatusCourseDto.status },
    });
  }
}
