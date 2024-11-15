import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Courses } from './courses.interface';
import { Course, CourseEnrollment, User } from '@prisma/client';
import {
  ChangeStatusCourseDto,
  CreateCourseDto,
  DeleteCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

@Injectable()
export class CoursesService implements Courses {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      return await this.prismaService.course.create({ data: createCourseDto });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Course | null> {
    try {
      const course = await this.prismaService.course.findUnique({
        where: { id },
      });
      if (!course)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return course;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMany(ownerId: number): Promise<Array<Course>> {
    try {
      return await this.prismaService.course.findMany({
        where: { ownerId },
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<Course> {
    try {
      const courseFind = await this.prismaService.course.delete({
        where: { id },
      });

      if (!courseFind)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not exists',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return courseFind;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const courseFindFound = await this.prismaService.course.findUnique({
        where: {
          id: updateCourseDto.id,
        },
      });

      if (!courseFindFound)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return this.prismaService.course.update({
        where: { id: updateCourseDto.id },
        data: updateCourseDto,
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserOfCourse(id: number): Promise<Course> {
    try {
      const course = await this.prismaService.course.findUnique({
        where: { id },
      });
      if (!course)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return await this.prismaService.course.findUnique({
        where: { id },
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
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async joinToCourse(
    joinUserCourseDto: JoinUserCourseDto,
  ): Promise<CourseEnrollment> {
    try {
      const course = await this.prismaService.course.findUnique({
        where: {
          token: joinUserCourseDto.token,
        },
      });

      if (!course)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );

      const jointed = await this.prismaService.courseEnrollment.create({
        data: {
          userId: joinUserCourseDto.id,
          courseId: course.id,
        },
      });

      if (!jointed)
        throw new HttpException(
          {
            code: HttpStatus.NOT_MODIFIED,
            message: 'Error joining course',
            data: {},
          },
          HttpStatus.NOT_MODIFIED,
        );

      return jointed;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: { id: deleteCourseDto.idUser },
        data: { courses: { disconnect: [{ id: deleteCourseDto.idCourse }] } },
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeStatus(
    changeStatusCourseDto: ChangeStatusCourseDto,
  ): Promise<Course> {
    try {
      const course = await this.prismaService.course.update({
        where: { id: changeStatusCourseDto.id },
        data: { verified: changeStatusCourseDto.status },
      });

      if (!course)
        throw new HttpException(
          {
            code: HttpStatus.NOT_MODIFIED,
            message: 'Error, Course not updated',
            data: {},
          },
          HttpStatus.NOT_MODIFIED,
        );

      return course;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Array<Course>> {
    try {
      return await this.prismaService.course.findMany();
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
