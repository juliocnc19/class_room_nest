import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Activitiy } from './activities.interface';
import { Activities, ActivitiesSent, Post, Prisma } from '@prisma/client';
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
  }

  async findOne(id: number): Promise<Activities | null> {
    return this.prismaService.activities.findUnique({ where: { id } });
  }

  async findMany(course_id: number): Promise<Activities[] | []> {
    return this.prismaService.activities.findMany({
      where: { course_id },
    });
  }

  async delete(id: number): Promise<Activities> {
    return this.prismaService.activities.delete({ where: { id } });
  }

  async update(activities: UpdateActivitiesDto): Promise<Activities> {
    return this.prismaService.activities.update({
      where: { id: activities.id },
      data: activities,
    });
  }

  async myActivities(idUser: number): Promise<Activities[]> {
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
  }

  async myActivitiesSent(id_user: number): Promise<Activities[]> {
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
  }

  async activitiesForEvaluation(
    id_activity: number,
  ): Promise<ActivitiesSent[]> {
    return await this.prismaService.activitiesSent.findMany({
      where: {
        activity_id: id_activity,
      },
    });
  }

  async sendActivity(activitiy: SendActivityDto): Promise<ActivitiesSent> {
    return await this.prismaService.activitiesSent.create({ data: activitiy });
  }

  async activitiesSendForStudenInCourse(body: {
    user_id: number;
    course_id: number;
  }): Promise<ActivitiesSent[]> {
    return await this.prismaService.activitiesSent.findMany({
      where: {
        AND: [
          { user_id: body.user_id },
          { activity: { course_id: body.course_id } },
        ],
      },
    });
  }

  async findAll(): Promise<Activities[] | []> {
    return await this.prismaService.activities.findMany();
  }

  async assessActivity(data: AssessActivityDto): Promise<ActivitiesSent> {
    return await this.prismaService.activitiesSent.update({
      where: { id: data.id },
      data: { grade: data.grade },
    });
  }
}
