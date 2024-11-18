import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import {
  AssessActivityDto,
  CreateActivitiesDto,
  SendActivityDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async create(@Body() activitiy: CreateActivitiesDto) {
    const activity = await this.activitiesService.create(activitiy);
    return {
      code: HttpStatus.CREATED,
      message: 'Activity created successfully',
      data: activity,
    };
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const activity = await this.activitiesService.findOne(id);
    return {
      code: HttpStatus.OK,
      message: 'Activity found',
      data: activity,
    };
  }

  @Get('/course/:course_id')
  async findMany(@Param('course_id', ParseIntPipe) course_id: number) {
    const activity = await this.activitiesService.findMany(course_id);
    return {
      code: HttpStatus.OK,
      message: 'Activities found',
      data: activity,
    };
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const activity = await this.activitiesService.delete(id);
    return {
      code: HttpStatus.OK,
      message: 'Activity deleted',
      data: activity,
    };
  }

  @Put()
  async update(@Body() activity: UpdateActivitiesDto) {
    const activityUpdated = await this.activitiesService.update(activity);
    return {
      code: HttpStatus.OK,
      message: 'Activity updated',
      data: activityUpdated,
    };
  }

  @Get('/myActivities/:id_user')
  async myActivities(@Param('id_user', ParseIntPipe) idUser: number) {
    const activities = await this.activitiesService.myActivities(idUser);
    return {
      code: HttpStatus.OK,
      message: 'Activities found',
      data: activities,
    };
  }

  @Get('mine/sent/:id_user')
  async myActivitiesSent(@Param('id_user', ParseIntPipe) id_user: number) {
    const activitiesSent =
      await this.activitiesService.myActivitiesSent(id_user);
    return {
      code: HttpStatus.OK,
      message: 'Activities found',
      data: activitiesSent,
    };
  }

  @Get('for/evaluation/:id_activity')
  async activitiesForEvaluation(
    @Param('id_activity', ParseIntPipe)
    id_activity: number,
  ) {
    const activities =
      await this.activitiesService.activitiesForEvaluation(id_activity);
    return {
      code: HttpStatus.OK,
      message: 'Activities found',
      data: activities,
    };
  }

  @Post('send/activity')
  async sendActivity(@Body() activitiy: SendActivityDto) {
    const activity = await this.activitiesService.sendActivity(activitiy);
    return {
      code: HttpStatus.CREATED,
      message: 'Activity sent successfully',
      data: activity,
    };
  }

  @Get('/send/course/user/:user_id/:course_id')
  async activitiesSendForStudenInCourse(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    const activities =
      await this.activitiesService.activitiesSendForStudenInCourse(
        user_id,
        course_id,
      );
    return {
      code: HttpStatus.OK,
      message: 'Activity found',
      data: activities,
    };
  }

  @Get('find/all')
  async findAll() {
    const activities = await this.activitiesService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'Activities found',
      data: activities,
    };
  }

  @Post('assess/activity')
  async assessActivity(@Body() data: AssessActivityDto) {
    const activity = await this.activitiesService.assessActivity(data);
    return {
      code: HttpStatus.CREATED,
      message: 'Activity evaluated',
      data: activity,
    };
  }
}
