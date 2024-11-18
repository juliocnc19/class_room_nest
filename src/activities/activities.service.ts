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

  async findMany(course_id: number): Promise<Activities[] | []> {
    try {
      return this.prismaService.activities.findMany({
        where: { course_id },
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
      return await this.prismaService.activities.findMany();
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
