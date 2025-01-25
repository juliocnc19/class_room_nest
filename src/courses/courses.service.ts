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
import { NotificationsService } from 'src/notifications/notifications.service';
import { ApiResponse, errorResponse, successResponse } from 'src/utils/responseHttpUtils';

@Injectable()
export class CoursesService implements Courses {
  constructor(
    private readonly prismaService: PrismaService,
     private notificationsService: NotificationsService
     ) {}

     async create(createCourseDto: CreateCourseDto): Promise<ApiResponse<Course>> {  
      try {
        const course = await this.prismaService.course.create({ data: createCourseDto });
        return successResponse(course, 'Curso creado exitosamente');
      } catch (error) {
        return errorResponse('Error al crear el curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async findOne(id: number) {
      try {
        const course = await this.prismaService.course.findUnique({ where: { id } });
        if (!course) {
          return errorResponse('Curso no encontrado', HttpStatus.NOT_FOUND);
        }
        return successResponse(course, 'Curso encontrado exitosamente');
      } catch (error) {
        return errorResponse('Error al buscar el curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async findMany(ownerId: number) {
      try {
        const courses = await this.prismaService.course.findMany({ where: { ownerId } });
        return successResponse(courses, 'Lista de cursos obtenida exitosamente');
      } catch (error) {
        return errorResponse('Error al obtener los cursos', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async delete(id: number) {
      try {
        const deletedCourse = await this.prismaService.course.delete({ where: { id } });
        return successResponse(deletedCourse, 'Curso eliminado exitosamente');
      } catch (error) {
        return errorResponse('Error al eliminar el curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async update(updateCourseDto: UpdateCourseDto) {
      try {
        const course = await this.prismaService.course.findUnique({ where: { id: updateCourseDto.id } });
        if (!course) {
          return errorResponse('Curso no encontrado', HttpStatus.NOT_FOUND);
        }
        const updatedCourse = await this.prismaService.course.update({
          where: { id: updateCourseDto.id },
          data: updateCourseDto,
        });
        return successResponse(updatedCourse, 'Curso actualizado exitosamente');
      } catch (error) {
        return errorResponse('Error al actualizar el curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async findUserOfCourse(id: number) {
      try {
        const course = await this.prismaService.course.findUnique({ where: { id } });
        if (!course) {
          return errorResponse('Curso no encontrado', HttpStatus.NOT_FOUND);
        }
        const courseWithUsers = await this.prismaService.course.findUnique({
          where: { id },
          include: {
            users: { include: { user: true } },
            area: { select: { area: true } },
          },
        });
        return successResponse(courseWithUsers, 'Usuarios del curso obtenidos exitosamente');
      } catch (error) {
        return errorResponse('Error al obtener los usuarios del curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async joinToCourse(joinUserCourseDto: JoinUserCourseDto) {
      try {
        const course = await this.prismaService.course.findUnique({
          where: { token: joinUserCourseDto.token },
          include: {
            owner: true,
            users: {
              include: {
                user: true,
              },
            },
          },
        });
    
        if (!course) {
          return errorResponse('Curso no encontrado', HttpStatus.NOT_FOUND);
        }
    
        const existingEnrollment = course.users.find(
          (enrollment) => enrollment.userId === joinUserCourseDto.id
        );
    
        if (existingEnrollment) {
          return errorResponse('El usuario ya está inscrito en este curso', HttpStatus.CONFLICT);
        }
    
        const enrollment = await this.prismaService.courseEnrollment.create({
          data: { userId: joinUserCourseDto.id, courseId: course.id },
        });
    
        const user = await this.prismaService.user.findUnique({ where: { id: joinUserCourseDto.id } });
        if (!user) {
          return errorResponse('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
    
        if (course.owner.firebaseToken) {
          await this.notificationsService.sendNotification({
            tokens: [course.owner.firebaseToken],
            title: `Un nuevo usuario se ha unido a tu curso`,
            body: `${user.name} ${user.last_name} se unió al curso "${course.title}".`,
            data: { courseId: course.id.toString(), userId: user.id.toString() },
          });
        }
    
        const updatedCourse = await this.prismaService.course.findUnique({
          where: { id: course.id },
          // include: {
          //   users: { include: { user: true } },
          //   area: { select: { area: true } },
          // },
        });
    
        return successResponse(updatedCourse, 'Usuario añadido al curso exitosamente');
      } catch (error) {
        return errorResponse('Error al unirse al curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async delteUserOfCourse(deleteCourseDto: DeleteCourseDto) {
      try {
        const updatedUser = await this.prismaService.user.update({
          where: { id: deleteCourseDto.idUser },
          data: { courses: { disconnect: [{ id: deleteCourseDto.idCourse }] } },
        });
        return successResponse(updatedUser, 'Usuario eliminado del curso exitosamente');
      } catch (error) {
        return errorResponse('Error al eliminar el usuario del curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async changeStatus(changeStatusCourseDto: ChangeStatusCourseDto) {
      try {
        const updatedCourse = await this.prismaService.course.update({
          where: { id: changeStatusCourseDto.id },
          data: { verified: changeStatusCourseDto.status },
        });
        return successResponse(updatedCourse, 'Estado del curso actualizado exitosamente');
      } catch (error) {
        return errorResponse('Error al cambiar el estado del curso', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async findAll() {
      try {
        const courses = await this.prismaService.course.findMany();
        return successResponse(courses, 'Lista de cursos obtenida exitosamente');
      } catch (error) {
        return errorResponse('Error al obtener los cursos', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }
  
    async findCourseOfUser(userId: number) {
      try {
        const courses = await this.prismaService.course.findMany({
          where: {
            OR: [{ ownerId: userId }, { users: { some: { userId } } }],
          },
        });
        return successResponse(courses, 'Cursos del usuario obtenidos exitosamente');
      } catch (error) {
        return errorResponse('Error al obtener los cursos del usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
    }

  // async create(createCourseDto: CreateCourseDto): Promise<Course> {
  //   try {
  //     return await this.prismaService.course.create({ data: createCourseDto });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findOne(id: number): Promise<Course | null> {
  //   try {
  //     const course = await this.prismaService.course.findUnique({
  //       where: { id },
  //     });
  //     if (!course)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return course;
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findMany(ownerId: number): Promise<Array<Course>> {
  //   try {
  //     return await this.prismaService.course.findMany({
  //       where: { ownerId },
  //     });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async delete(id: number): Promise<Course> {
  //   try {
  //     const courseFind = await this.prismaService.course.delete({
  //       where: { id },
  //     });

  //     if (!courseFind)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not exists',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return courseFind;
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async update(updateCourseDto: UpdateCourseDto): Promise<Course> {
  //   try {
  //     const courseFindFound = await this.prismaService.course.findUnique({
  //       where: {
  //         id: updateCourseDto.id,
  //       },
  //     });

  //     if (!courseFindFound)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return this.prismaService.course.update({
  //       where: { id: updateCourseDto.id },
  //       data: updateCourseDto,
  //     });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findUserOfCourse(id: number): Promise<Course> {
  //   try {
  //     const course = await this.prismaService.course.findUnique({
  //       where: { id },
  //     });
  //     if (!course)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return await this.prismaService.course.findUnique({
  //       where: { id },
  //       include: {
  //         users: {
  //           include: {
  //             user: true,
  //           },
  //         },
  //         area: {
  //           select: {
  //             area: true,
  //           },
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async joinToCourse(
  //   joinUserCourseDto: JoinUserCourseDto,
  // ): Promise<CourseEnrollment> {
  //   try {
  //     // Fetch the course details using the token
  //     const course = await this.prismaService.course.findUnique({
  //       where: {
  //         token: joinUserCourseDto.token,
  //       },
  //       include: {
  //         owner: true, // Include course owner details
  //       },
  //     });
  
  //     if (!course) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  
  //     // Add the user to the course
  //     const jointed = await this.prismaService.courseEnrollment.create({
  //       data: {
  //         userId: joinUserCourseDto.id,
  //         courseId: course.id,
  //       },
  //     });
  
  //     if (!jointed) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_MODIFIED,
  //           message: 'Error joining course',
  //           data: {},
  //         },
  //         HttpStatus.NOT_MODIFIED,
  //       );
  //     }
  
  //     // Fetch the joining user's details
  //     const user = await this.prismaService.user.findUnique({
  //       where: { id: joinUserCourseDto.id },
  //     });
  
  //     if (!user) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'User not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  
  //     // Send a notification to the course owner
  //     const ownerToken = course.owner.firebaseToken;
  //     if (ownerToken) {
  //       const notificationTitle = `A new user joined your course`;
  //       const notificationBody = `${user.name} ${user.last_name} has joined the course "${course.title}".`;
  
  //       await this.notificationsService.sendNotification({
  //         tokens: [ownerToken],
  //         title: notificationTitle,
  //         body: notificationBody,
  //         data: {
  //           courseId: course.id.toString(),
  //           userId: user.id.toString(),
  //         },
  //       });
  //     }
  
  //     return jointed;
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  

  // async delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<User> {
  //   try {
  //     return await this.prismaService.user.update({
  //       where: { id: deleteCourseDto.idUser },
  //       data: { courses: { disconnect: [{ id: deleteCourseDto.idCourse }] } },
  //     });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async changeStatus(
  //   changeStatusCourseDto: ChangeStatusCourseDto,
  // ): Promise<Course> {
  //   try {
  //     const course = await this.prismaService.course.update({
  //       where: { id: changeStatusCourseDto.id },
  //       data: { verified: changeStatusCourseDto.status },
  //     });

  //     if (!course)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_MODIFIED,
  //           message: 'Error, Course not updated',
  //           data: {},
  //         },
  //         HttpStatus.NOT_MODIFIED,
  //       );

  //     return course;
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findAll(): Promise<Array<Course>> {
  //   try {
  //     return await this.prismaService.course.findMany();
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findCourseOfUser(user_id: number): Promise<Array<Course>> {
  //   try {
  //     return await this.prismaService.course.findMany({
  //       where: {
  //         OR: [{ ownerId: user_id }, { users: { some: { userId: user_id } } }],
  //       },
  //     });
  //   } catch (e) {
  //     const error = e as Error;
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
