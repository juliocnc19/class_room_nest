import { Course, User } from '@prisma/client';
import {
  ChangeStatusCourseDto,
  CreateCourseDto,
  DeleteCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

export interface Courses {
  create(course: CreateCourseDto): Promise<Course>;
  findOne(id: number): Promise<Course | null>;
  findMany(ownerId: number): Promise<Array<Course>>;
  delete(id: number): Promise<Course>;
  update(course: UpdateCourseDto): Promise<Course>;
  findUserOfCourse(course_id: number): Promise<Course>;
  joinToCourse(joinUserCourseDto: JoinUserCourseDto): Promise<Course>;
  delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<User>;
  changeStatus(changeStatusCourseDto: ChangeStatusCourseDto): Promise<Course>;
  findAll(): Promise<Array<Course>>;
}
