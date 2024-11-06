import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de tener el servicio Prisma configurado
import { CreateCourseDto, UpdateCourseDto, CreateActivityDto, UpdateActivityDto, CreateUserDto, UpdateUserDto } from './dto';
import { Activities, Course, Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // CRUD para los Cursos
 
  // CRUD para los Cursos
  async createCourse(createCourseDto: CreateCourseDto) {
    const { ownerId, areaId, ...rest } = createCourseDto;
    return await this.prisma.course.create({
      data: {
        ...rest,
        owner: { connect: { id: ownerId } },
        area: { connect: { id: areaId } },
      },
    });
  }

  async findAllCourses() {
    return await this.prisma.course.findMany();
  }

  async findCourseById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async updateCourse(id: number, updateCourseDto: UpdateCourseDto) {
    const { ownerId, areaId, ...rest } = updateCourseDto;
    return await this.prisma.course.update({
      where: { id },
      data: {
        ...rest,
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
        ...(areaId ? { area: { connect: { id: areaId } } } : {}),
      },
    });
  }

  async deleteCourse(id: number) {
    const course = await this.prisma.course.delete({
      where: { id },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  // CRUD para los Usuarios
  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAllUsers() {
    return await this.prisma.user.findMany();
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // CRUD para las Actividades
  async createActivity(createActivityDto: CreateActivityDto) {
    const { course_id, status, ...rest } = createActivityDto;
    return await this.prisma.activities.create({
      data: {
        ...rest,
        course: { connect: { id: course_id } },
        status: status, // Asumiendo que `status` ya tiene la estructura correcta para ser usado en Prisma
      },
    });
  }

  async findAllActivities() {
    return await this.prisma.activities.findMany();
  }

  async updateActivity(id: number, updateActivityDto: UpdateActivityDto) {
    const { course_id, status, ...rest } = updateActivityDto;
    return await this.prisma.activities.update({
      where: { id },
      data: {
        ...rest,
        ...(course_id ? { course: { connect: { id: course_id } } } : {}),
        ...(status ? { status: status } : {}),
      },
    });
  }

  async deleteActivity(id: number) {
    return await this.prisma.activities.delete({
      where: { id },
    });
  }


}
