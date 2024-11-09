import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Activitiy } from './activities.interface';
import { Activities, ActivitiesSent } from '@prisma/client';
import { CloudService } from 'src/cloud/cloud.service';
import {
  ActivitiesSendForStudenInCourse,
  CreateActivitiesDto,
  FindActivitiesForEvaluationDto,
  FindActivitiesForUserDto,
  FindManyActivitiesDto,
  FindOneActivitiesDto,
  SendActivityDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';

@Injectable()
export class ActivitiesService implements Activitiy {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudService: CloudService,
  ) {}

  async create(activitiy: CreateActivitiesDto): Promise<Activities> {
    return this.prismaService.activities.create({ data: activitiy });
  }

  async findOne(id: FindOneActivitiesDto): Promise<Activities | null> {
    return this.prismaService.activities.findUnique({ where: { id: id.id } });
  }

  async findMany(course_id: FindManyActivitiesDto): Promise<Activities[] | []> {
    return this.prismaService.activities.findMany({
      where: { course_id: course_id.course_id },
    });
  }

  async delete(id: FindOneActivitiesDto): Promise<Activities> {
    return this.prismaService.activities.delete({ where: { id: id.id } });
  }

  async update(activities: UpdateActivitiesDto): Promise<Activities> {
    return this.prismaService.activities.update({
      where: { id: activities.id },
      data: activities,
    });
  }

  async myActivities(idUser: FindActivitiesForUserDto): Promise<Activities[]> {
    return await this.prismaService.activities.findMany({
      where: {
        OR: [{ course: { users: { some: { userId: idUser.userId } } } }],
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
  }

  async myActivitiesSent(
    id_user: FindActivitiesForUserDto,
  ): Promise<Activities[]> {
    return await this.prismaService.activities.findMany({
      where: {
        OR: [{ course: { users: { some: { userId: id_user.userId } } } }],
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
  }

  async activitiesForEvaluation(
    id_activity: FindActivitiesForEvaluationDto,
  ): Promise<ActivitiesSent[]> {
    return await this.prismaService.activitiesSent.findMany({
      where: {
        activity_id: id_activity.id_activity,
      },
    });
  }

  async sendActivity(activitiy: SendActivityDto): Promise<ActivitiesSent> {
    return await this.prismaService.activitiesSent.create({ data: activitiy });
  }

  async activitiesSendForStudenInCourse(
    body: ActivitiesSendForStudenInCourse,
  ): Promise<ActivitiesSent[]> {
    return await this.prismaService.activitiesSent.findMany({
      where: {
        AND: [
          { user_id: body.user_id },
          { activity: { course_id: body.course_id } },
        ],
      },
    });
  }
}
