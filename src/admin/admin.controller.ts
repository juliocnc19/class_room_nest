
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateCourseDto, UpdateCourseDto, CreateActivityDto, UpdateActivityDto, CreateUserDto, UpdateUserDto,  } from './dto';
import { Prisma } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Endpoints para los Cursos
  @Post('courses')
  async createCourse(@Body() createCourseDto: Prisma.CourseCreateInput) {
    return this.adminService.createCourse(createCourseDto);
  }

  @Get('courses')
  async findAllCourses() {
    return this.adminService.findAllCourses();
  }

  @Get('courses/:id')
  async findCourseById(@Param('id') id: number) {
    return this.adminService.findCourseById(id);
  }

  @Patch('courses/:id')
  async updateCourse(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.adminService.updateCourse(id, updateCourseDto);
  }

  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: number) {
    return this.adminService.deleteCourse(id);
  }

  // Endpoints para los Usuarios
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Get('users')
  async findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  async findUserById(@Param('id') id: number) {
    return this.adminService.findUserById(id);
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  // Endpoints para las Actividades
  @Post('activities')
  async createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.adminService.createActivity(createActivityDto);
  }

  @Get('activities')
  async findAllActivities() {
    return this.adminService.findAllActivities();
  }

  @Patch('activities/:id')
  async updateActivity(@Param('id') id: number, @Body() updateActivityDto: UpdateActivityDto) {
    return this.adminService.updateActivity(id, updateActivityDto);
  }

  @Delete('activities/:id')
  async deleteActivity(@Param('id') id: number) {
    return this.adminService.deleteActivity(id);
  }

}

