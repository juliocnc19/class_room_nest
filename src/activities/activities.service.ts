import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Activitiy } from './activities.interface';
import { Activities, ActivitiesSent } from '@prisma/client';
import {
  AssessActivityDto,
  CreateActivitiesDto,
  SendActivityDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ApiResponse, errorResponse, successResponse } from 'src/utils/responseHttpUtils';

@Injectable()
export class ActivitiesService implements Activitiy {
  constructor(private readonly prismaService: PrismaService, private notificationsService: NotificationsService) {}
  async activitiesSendForStudenInCourse(user_id: number, course_id: number): Promise<ApiResponse<ActivitiesSent[]>> {

      try {
      const activities = await this.prismaService.activitiesSent.findMany({
        where: {
          AND: [{ user_id: user_id }, { activity: { course_id: course_id } }],
        },
      });

      return successResponse(activities, 'Actividades enviadas para el estudiante obtenidas exitosamente');
    } catch (e) {
  
      return errorResponse('Error al obtener actividades enviadas para el estudiante', HttpStatus.INTERNAL_SERVER_ERROR, e);
    }
  }


  async create(activity: CreateActivitiesDto) {
    try {
      const resActivity = await this.prismaService.activities.create({
        data: activity,
      });

      const course = await this.prismaService.course.findUnique({
        where: { id: activity.course_id },
      });

      if (!course) {
        return errorResponse('Curso no encontrado', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.post.create({
        data: {
          title: activity.title,
          content: '',
          courseId: activity.course_id,
          activityId: resActivity.id,
          authorId: course.ownerId,
        },
      });

      const enrolledUsers = await this.prismaService.courseEnrollment.findMany({
        where: { courseId: activity.course_id },
        include: {
          user: true,
        },
      });

      const tokens = enrolledUsers
        .map((enrollment) => enrollment.user.firebaseToken)
        .filter((token) => token);

      if (tokens.length > 0) {
        const notificationTitle = `Nueva actividad en el curso ${course.title}`;
        const notificationBody = `La actividad "${activity.title}" ha sido creada.`;
        await this.notificationsService.sendNotification({
          tokens,
          title: notificationTitle,
          body: notificationBody,
          data: {
            courseId: activity.course_id.toString(),
            activityId: resActivity.id.toString(),
          },
        });
      }

      return successResponse(resActivity, 'Actividad creada exitosamente');
    } catch (error) {
      return errorResponse('Error al crear la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findOne(id: number) {
    try {
      const activity = await this.prismaService.activities.findUnique({
        where: { id },
      });

      if (!activity) {
        return errorResponse('Actividad no encontrada', HttpStatus.NOT_FOUND);
      }

      return successResponse(activity, 'Actividad encontrada exitosamente');
    } catch (error) {
      return errorResponse('Error al buscar la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findMany(course_id: number) {
    try {
      const activities = await this.prismaService.activities.findMany({
        where: { course_id },
        include: {
          quizz: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });

      return successResponse(activities, 'Actividades obtenidas exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener las actividades', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async delete(id: number) {
    try {
      const activity = await this.prismaService.activities.delete({
        where: { id },
      });

      return successResponse(activity, 'Actividad eliminada exitosamente');
    } catch (error) {
      return errorResponse('Error al eliminar la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(activities: UpdateActivitiesDto) {
    try {
      const updatedActivity = await this.prismaService.activities.update({
        where: { id: activities.id },
        data: activities,
      });

      return successResponse(updatedActivity, 'Actividad actualizada exitosamente');
    } catch (error) {
      return errorResponse('Error al actualizar la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async myActivities(idUser: number) {
    try {
      const activities = await this.prismaService.activities.findMany({
        where: {
          OR: [{ course: { users: { some: { userId: idUser } } } }],
        },
        include: {
          status: { select: { status: true } },
          course: { select: { title: true } },
          quizz: true,
        },
      });

      return successResponse(activities, 'Actividades del usuario obtenidas exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener las actividades del usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async myActivitiesSent(id_user: number) {
    try {
      const activities = await this.prismaService.activities.findMany({
        where: {
          OR: [{ course: { users: { some: { userId: id_user } } } }],
        },
        include: {
          activities_send: true,
          quizz: { include: { sent: true } },
        },
      });

      return successResponse(activities, 'Actividades enviadas por el usuario obtenidas exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener las actividades enviadas', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async activitiesForEvaluation(id_activity: number) {
    try {
      const activities = await this.prismaService.activitiesSent.findMany({
        where: { activity_id: id_activity },
      });

      return successResponse(activities, 'Actividades para evaluación obtenidas exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener actividades para evaluación', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async sendActivity(activity: SendActivityDto) {
    try {
      const sentActivity = await this.prismaService.activitiesSent.create({
        data: activity,
      });

      return successResponse(sentActivity, 'Actividad enviada exitosamente');
    } catch (error) {
      return errorResponse('Error al enviar la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async activitiesSendForStudentInCourse(user_id: number, course_id: number) {
    try {
      const activities = await this.prismaService.activitiesSent.findMany({
        where: {
          AND: [{ user_id: user_id }, { activity: { course_id: course_id } }],
        },
      });

      return successResponse(activities, 'Actividades enviadas para el estudiante obtenidas exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener actividades enviadas para el estudiante', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findAll() {
    try {
      const activities = await this.prismaService.activities.findMany({
        include: { quizz: true },
      });

      return successResponse(activities, 'Lista de actividades obtenida exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener la lista de actividades', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async assessActivity(data: AssessActivityDto) {
    try {
      const assessedActivity = await this.prismaService.activitiesSent.update({
        where: { id: data.id },
        data: { grade: data.grade },
      });

      return successResponse(assessedActivity, 'Actividad evaluada exitosamente');
    } catch (error) {
      return errorResponse('Error al evaluar la actividad', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
  // async create(activity: CreateActivitiesDto): Promise<Activities> {
  //   try {
  //     // Create the activity in the database
  //     const resActivity = await this.prismaService.activities.create({
  //       data: activity,
  //     });
  
  //     // Fetch the course details
  //     const course = await this.prismaService.course.findUnique({
  //       where: { id: activity.course_id },
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
  
  //     // Create a post associated with the activity
  //     await this.prismaService.post.create({
  //       data: {
  //         title: activity.title,
  //         content: '',
  //         courseId: activity.course_id,
  //         activityId: resActivity.id,
  //         authorId: course.ownerId,
  //       },
  //     });
  
  //     // Fetch all users enrolled in the course
  //     const enrolledUsers = await this.prismaService.courseEnrollment.findMany({
  //       where: { courseId: activity.course_id },
  //       include: {
  //         user: true, // Include user details to access firebaseToken
  //       },
  //     });
  
  //     // Collect valid Firebase tokens
  //     const tokens = enrolledUsers
  //       .map((enrollment) => enrollment.user.firebaseToken)
  //       .filter((token) => token); // Exclude null or empty tokens
  
  //     if (tokens.length > 0) {
  //       // Send notification to enrolled users
  //       const notificationTitle = `New activity in course ${course.title}`;
  //       const notificationBody = `Activity "${activity.title}" has been created.`;
  //       await this.notificationsService.sendNotification({
  //         tokens,
  //         title: notificationTitle,
  //         body: notificationBody,
  //         data: {
  //           courseId: activity.course_id.toString(),
  //           activityId: resActivity.id.toString(),
  //         },
  //       });
  //     }
  
  //     return resActivity;
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
  

  // async findOne(id: number): Promise<Activities | null> {
  //   try {
  //     const activity = await this.prismaService.activities.findUnique({
  //       where: { id },
  //     });

  //     if (!activity)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Activity not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return activity;
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


  // async findMany(course_id: number): Promise<ActivityResponse[]> {
  //   try {
  //     const activities = await this.prismaService.activities.findMany({
  //       where: { course_id },
  //       include: {
  //         quizz: {
  //           include: {
  //             question: {
  //               include: {
  //                 options: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  
  //     // Map the result to match the ActivityResponse interface
  //     return activities.map((activity) => ({
  //       id: activity.id,
  //       course_id: activity.course_id,
  //       title: activity.title,
  //       description: activity.description,
  //       grade: activity.grade.toNumber(), // Convert Decimal to string
  //       start_date: activity.start_date,
  //       end_date: activity.end_date,
  //       email: activity.email,
  //       digital: activity.digital,
  //       isQuizz: activity.isQuizz,
  //       status_id: activity.status_id,
  //       quizzId: activity.quizz?.[0]?.id || null,
  //       questions: activity.quizz?.[0]?.question.map((question) => ({
  //         id: question.id,
  //         text: question.text,
  //         answer: question.answer,
  //         options: question.options.map((option) => ({
  //           id: option.id,
  //           text: option.text,
  //         })),
  //       })) || [],
  //     }));
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

  // async delete(id: number): Promise<Activities> {
  //   try {
  //     const activity = await this.prismaService.activities.delete({
  //       where: { id },
  //     });

  //     if (!activity)
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Activity not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     return activity;
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

  // async update(activities: UpdateActivitiesDto): Promise<Activities> {
  //   try {
  //     return this.prismaService.activities.update({
  //       where: { id: activities.id },
  //       data: activities,
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

  // async myActivities(idUser: number): Promise<Activities[]> {
  //   try {
  //     return await this.prismaService.activities.findMany({
  //       where: {
  //         OR: [{ course: { users: { some: { userId: idUser } } } }],
  //       },
  //       include: {
  //         status: {
  //           select: {
  //             status: true,
  //           },
  //         },
  //         course: {
  //           select: {
  //             title: true,
  //           },
  //         },
  //         quizz: true,
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

  // async myActivitiesSent(id_user: number): Promise<Activities[]> {
  //   try {
  //     return await this.prismaService.activities.findMany({
  //       where: {
  //         OR: [{ course: { users: { some: { userId: id_user } } } }],
  //       },
  //       include: {
  //         activities_send: true,
  //         quizz: {
  //           include: {
  //             sent: true,
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

  // async activitiesForEvaluation(
  //   id_activity: number,
  // ): Promise<ActivitiesSent[]> {
  //   try {
  //     return await this.prismaService.activitiesSent.findMany({
  //       where: {
  //         activity_id: id_activity,
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

  // async sendActivity(activitiy: SendActivityDto): Promise<ActivitiesSent> {
  //   try {
  //     return await this.prismaService.activitiesSent.create({
  //       data: activitiy,
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

  // async activitiesSendForStudenInCourse(
  //   user_id: number,
  //   course_id: number,
  // ): Promise<ActivitiesSent[]> {
  //   try {
  //     return await this.prismaService.activitiesSent.findMany({
  //       where: {
  //         AND: [{ user_id: user_id }, { activity: { course_id: course_id } }],
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

  // async findAll(): Promise<Activities[] | []> {
  //   try {
  //     return await this.prismaService.activities.findMany({
  //       include: {
  //         quizz: true,
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

  // async assessActivity(data: AssessActivityDto): Promise<ActivitiesSent> {
  //   try {
  //     return await this.prismaService.activitiesSent.update({
  //       where: { id: data.id },
  //       data: { grade: data.grade },
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
