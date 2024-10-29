import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Activitiy } from './activities.interface';
import { Activities } from '@prisma/client';

@Injectable()
export class ActivitiesService implements Activitiy {
  constructor(private readonly prismaService: PrismaService) {}

  async create(activitiy: Activities): Promise<Activities> {
    return this.prismaService.activities.create({ data: activitiy });
  }

  async findOne(id: number): Promise<Activities | null> {
    return this.prismaService.activities.findUnique({ where: { id } });
  }

  async findMany(course_id: number): Promise<Activities[] | []> {
    return this.prismaService.activities.findMany({ where: { course_id } });
  }

  async delete(id: number): Promise<Activities> {
    return this.prismaService.activities.delete({ where: { id } });
  }

  async update(activities: Activities): Promise<Activities> {
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
}
