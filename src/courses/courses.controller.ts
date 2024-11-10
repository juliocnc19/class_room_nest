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
import { ApiTags } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import {
  ChangeStatusCourseDto,
  CreateCourseDto,
  DeleteCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    const uniqueToken = randomBytes(8).toString('hex');
    createCourseDto.token = uniqueToken;
    return await this.coursesService.create(createCourseDto);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.coursesService.findOne(id);
  }

  @Get('/owner/:ownerId')
  async findMany(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return await this.coursesService.findMany(ownerId);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.coursesService.delete(id);
  }

  @Put('/')
  async update(@Body() course: UpdateCourseDto) {
    return await this.coursesService.update(course);
  }

  @Get('/users/:id')
  async findUserOfCourse(@Param('id', ParseIntPipe) course_id: number) {
    return await this.coursesService.findUserOfCourse(course_id);
  }

  @Post('/join')
  async joinToCourse(@Body() joinUserCourseDto: JoinUserCourseDto) {
    return await this.coursesService.joinToCourse(joinUserCourseDto);
  }

  @Delete('/delete/user/')
  async delteUserOfCourse(@Body() deleteCourseDto: DeleteCourseDto) {
    return await this.coursesService.delteUserOfCourse(deleteCourseDto);
  }

  @Put('/change/status')
  async changeStatus(@Body() changeStatusCourseDto: ChangeStatusCourseDto) {
    return await this.coursesService.changeStatus(changeStatusCourseDto);
  }

  @Get('/find/all')
  async findAll() {
    return await this.coursesService.findAll();
  }
}
