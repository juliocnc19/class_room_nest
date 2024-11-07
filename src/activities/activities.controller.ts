import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateActivitiesDto,
  FindActivitiesForEvaluationDto,
  FindActivitiesForUserDto,
  FindManyActivitiesDto,
  FindOneActivitiesDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';

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
}
