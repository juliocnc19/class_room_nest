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

@Injectable()
export class ActivitiesService implements Activitiy {
  constructor(private readonly prismaService: PrismaService) {}

  async create(activitiy: CreateActivitiesDto): Promise<Activities> {
    try {
      const resActivity = await this.prismaService.activities.create({
        data: activitiy,
      });

      const course = await this.prismaService.course.findUnique({
        where: { id: activitiy.course_id },
      });

      await this.prismaService.post.create({
        data: {
          title: activitiy.title,
          content: '',
          courseId: activitiy.course_id,
          activityId: resActivity.id,
          authorId: course.ownerId,
        },
      });
      return resActivity;
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

  async findOne(id: number): Promise<Activities | null> {
    try {
      const activity = await this.prismaService.activities.findUnique({
        where: { id },
      });

      if (!activity)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Activity not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return activity;
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


  async findMany(course_id: number): Promise<ActivityResponse[]> {
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
  
      // Map the result to match the ActivityResponse interface
      return activities.map((activity) => ({
        id: activity.id,
        course_id: activity.course_id,
        title: activity.title,
        description: activity.description,
        grade: activity.grade.toNumber(), // Convert Decimal to string
        start_date: activity.start_date,
        end_date: activity.end_date,
        email: activity.email,
        digital: activity.digital,
        isQuizz: activity.isQuizz,
        status_id: activity.status_id,
        quizzId: activity.quizz?.[0]?.id || null,
        questions: activity.quizz?.[0]?.question.map((question) => ({
          id: question.id,
          text: question.text,
          answer: question.answer,
          options: question.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
        })) || [],
      }));
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

  async delete(id: number): Promise<Activities> {
    try {
      const activity = await this.prismaService.activities.delete({
        where: { id },
      });

      if (!activity)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Activity not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return activity;
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

  async update(activities: UpdateActivitiesDto): Promise<Activities> {
    try {
      return this.prismaService.activities.update({
        where: { id: activities.id },
        data: activities,
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

  async myActivities(idUser: number): Promise<Activities[]> {
    try {
      return await this.prismaService.activities.findMany({
        where: {
          OR: [{ course: { users: { some: { userId: idUser } } } }],
        },
        include: {
          status: {
            select: {
              status: true,
            },
          },
          course: {
            select: {
              title: true,
            },
          },
          quizz: true,
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

  async myActivitiesSent(id_user: number): Promise<Activities[]> {
    try {
      return await this.prismaService.activities.findMany({
        where: {
          OR: [{ course: { users: { some: { userId: id_user } } } }],
        },
        include: {
          activities_send: true,
          quizz: {
            include: {
              sent: true,
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

  async activitiesForEvaluation(
    id_activity: number,
  ): Promise<ActivitiesSent[]> {
    try {
      return await this.prismaService.activitiesSent.findMany({
        where: {
          activity_id: id_activity,
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

  async sendActivity(activitiy: SendActivityDto): Promise<ActivitiesSent> {
    try {
      return await this.prismaService.activitiesSent.create({
        data: activitiy,
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

  async activitiesSendForStudenInCourse(
    user_id: number,
    course_id: number,
  ): Promise<ActivitiesSent[]> {
    try {
      return await this.prismaService.activitiesSent.findMany({
        where: {
          AND: [{ user_id: user_id }, { activity: { course_id: course_id } }],
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

  async findAll(): Promise<Activities[] | []> {
    try {
      return await this.prismaService.activities.findMany({
        include: {
          quizz: true,
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

  async assessActivity(data: AssessActivityDto): Promise<ActivitiesSent> {
    try {
      return await this.prismaService.activitiesSent.update({
        where: { id: data.id },
        data: { grade: data.grade },
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
}
