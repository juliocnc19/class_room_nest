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
    return this.activitiesService.create(activitiy);
    
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
   
  }

  @Get('/course/:course_id')
  async findMany(@Param('course_id', ParseIntPipe) course_id: number) {
    return this.activitiesService.findMany(course_id);
 
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.delete(id);

  }

  @Put()
  async update(@Body() activity: UpdateActivitiesDto) {
    return this.activitiesService.update(activity);
   
  }

  @Get('/myActivities/:id_user')
  async myActivities(@Param('id_user', ParseIntPipe) idUser: number) {
    return this.activitiesService.myActivities(idUser);

  }

  @Get('mine/sent/:id_user')
  async myActivitiesSent(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.activitiesService.myActivitiesSent(id_user);
 
  }

  @Get('for/evaluation/:id_activity')
  async activitiesForEvaluation(
    @Param('id_activity', ParseIntPipe)
    id_activity: number,
  ) {
    return this.activitiesService.activitiesForEvaluation(id_activity);
 
  }

  @Post('send/activity')
  async sendActivity(@Body() activitiy: SendActivityDto) {
    return this.activitiesService.sendActivity(activitiy);
  
  }

  @Get('/send/course/user/:user_id/:course_id')
  async activitiesSendForStudenInCourse(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return this.activitiesService.activitiesSendForStudenInCourse(
        user_id,
        course_id,
      );

  }

  @Get('find/all')
  async findAll() {
    return this.activitiesService.findAll();

  }

  @Post('assess/activity')
  async assessActivity(@Body() data: AssessActivityDto) {
    return this.activitiesService.assessActivity(data);
  
  }
}
