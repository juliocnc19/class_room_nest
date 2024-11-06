import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { randomBytes } from 'crypto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() course: Prisma.CourseCreateInput) {
    const uniqueToken = randomBytes(8).toString('hex');
    course.token = uniqueToken;
    return await this.coursesService.create(course);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: Prisma.CourseWhereUniqueInput) {
    return await this.coursesService.findOne(id);
  }

  @Get('/owner/:ownerId')
  async findMany(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return await this.coursesService.findMany(ownerId);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: Prisma.CourseWhereUniqueInput) {
    return await this.coursesService.delete(id);
  }

  @Put('/')
  async update(id: number, course: Prisma.CourseUpdateInput) {
    return await this.coursesService.update(id, course);
  }

  @Get('/users/:id')
  async findUserOfCourse(
    @Param('id', ParseIntPipe) course_id: Prisma.CourseWhereUniqueInput,
  ) {
    return await this.coursesService.findUserOfCourse(course_id);
  }

  @Post('/join')
  async joinToCourse(@Body() { id, token }) {
    return await this.coursesService.joinToCourse(id, token);
  }

  @Delete('/delete/user/')
  async delteUserOfCourse(@Body() { idUser, idCourse }) {
    return await this.coursesService.delteUserOfCourse(idUser, idCourse);
  }
}
