import { Course, CourseEnrollment, User } from '@prisma/client';
import {
  ChangeStatusCourseDto,
  CreateCourseDto,
  DeleteCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';
import { ApiResponse } from 'src/utils/responseHttpUtils';

export interface Courses {
  create(course: CreateCourseDto): Promise<ApiResponse<Course>>;
  findOne(id: number): Promise<ApiResponse<Course | null>> ;
  findMany(ownerId: number): Promise<ApiResponse<Array<Course>>>;
  delete(id: number): Promise<ApiResponse<Course>>;
  update(course: UpdateCourseDto): Promise<ApiResponse<Course>>;
  findUserOfCourse(course_id: number): Promise<ApiResponse<Course>>;
  joinToCourse(joinUserCourseDto: JoinUserCourseDto): Promise<ApiResponse<CourseEnrollment>>;
  delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<ApiResponse<User>>;
  changeStatus(changeStatusCourseDto: ChangeStatusCourseDto): Promise<ApiResponse<Course>>;
  findAll(): Promise<ApiResponse<Array<Course>>>;
  findCourseOfUser(user_id: number): Promise<ApiResponse<Array<Course>>>;
}
