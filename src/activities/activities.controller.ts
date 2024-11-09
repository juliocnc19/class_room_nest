import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
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
import { query } from 'express';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async create(@Body() activitiy: CreateActivitiesDto) {
    return await this.activitiesService.create(activitiy);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: FindOneActivitiesDto) {
    return await this.activitiesService.findOne(id);
  }

  @Get('/course/:course_id')
  async findMany(
    @Param('course_id', ParseIntPipe) course_id: FindManyActivitiesDto,
  ) {
    return await this.activitiesService.findMany(course_id);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: FindOneActivitiesDto) {
    return await this.activitiesService.delete(id);
  }

  @Put()
  async update(@Body() activity: UpdateActivitiesDto) {
    return this.activitiesService.update(activity);
  }

  @Get('/myActivities/:id_user')
  async myActivities(
    @Param('id_user', ParseIntPipe) idUser: FindActivitiesForUserDto,
  ) {
    return await this.activitiesService.myActivities(idUser);
  }

  @Get('mine/sent/:id_user')
  async myActivitiesSent(
    @Param('id_user', ParseIntPipe) id_user: FindActivitiesForUserDto,
  ) {
    return await this.activitiesService.myActivitiesSent(id_user);
  }

  @Get('for/evaluation/:id_activity')
  async activitiesForEvaluation(
    @Param('id_activity', ParseIntPipe)
    id_activity: FindActivitiesForEvaluationDto,
  ) {
    return await this.activitiesService.activitiesForEvaluation(id_activity);
  }

  @Post('send/activity')
  async sendActivity(@Body() activitiy: SendActivityDto) {
    return await this.activitiesService.sendActivity(activitiy);
  }

  @Get('/send/course/user/:user_id/:course_id')
  async activitiesSendForStudenInCourse(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return await this.activitiesService.activitiesSendForStudenInCourse({
      user_id,
      course_id,
    });
  }
}
