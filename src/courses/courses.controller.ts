import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
  Delete,
  Put,
  HttpStatus,
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
    const course = await this.coursesService.create(createCourseDto);
    return {
      code: HttpStatus.OK,
      message: 'Course created',
      data: course,
    };
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const course = await this.coursesService.findOne(id);
    return {
      code: HttpStatus.OK,
      message: 'Course found',
      data: course,
    };
  }

  @Get('/owner/:ownerId')
  async findMany(@Param('ownerId', ParseIntPipe) ownerId: number) {
    const courses = await this.coursesService.findMany(ownerId);
    return {
      code: HttpStatus.OK,
      message: 'Courses found',
      data: courses,
    };
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const course = await this.coursesService.delete(id);
    return {
      code: HttpStatus.OK,
      message: 'Course deleted',
      data: course,
    };
  }

  @Put('/')
  async update(@Body() course: UpdateCourseDto) {
    const courseUpdate = await this.coursesService.update(course);
    return {
      code: HttpStatus.OK,
      message: 'Course deleted',
      data: courseUpdate,
    };
  }

  @Get('/users/:id')
  async findUserOfCourse(@Param('id', ParseIntPipe) course_id: number) {
    const course = await this.coursesService.findUserOfCourse(course_id);
    return {
      code: HttpStatus.OK,
      message: 'Users found',
      data: course,
    };
  }

  @Post('/join')
  async joinToCourse(@Body() joinUserCourseDto: JoinUserCourseDto) {
    const jointed = await this.coursesService.joinToCourse(joinUserCourseDto);
    return {
      code: HttpStatus.OK,
      message: 'User joined',
      data: jointed,
    };
  }

  @Delete('/delete/user/')
  async delteUserOfCourse(@Body() deleteCourseDto: DeleteCourseDto) {
    const user = await this.coursesService.delteUserOfCourse(deleteCourseDto);
    return {
      code: HttpStatus.OK,
      message: 'User deleted',
      data: user,
    };
  }

  @Put('/change/status')
  async changeStatus(@Body() changeStatusCourseDto: ChangeStatusCourseDto) {
    const course = await this.coursesService.changeStatus(
      changeStatusCourseDto,
    );
    return {
      code: HttpStatus.OK,
      message: 'Course updated',
      data: course,
    };
  }

  @Get('/find/all')
  async findAll() {
    const courses = await this.coursesService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'Courses found',
      data: courses,
    };
  }
}
