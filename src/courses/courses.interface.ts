import { Course, User, Prisma } from '@prisma/client';
import {
  CreateCourseDto,
  DeleteCourseDto,
  FindManyCourseDto,
  FindOneCourseDto,
  JoinUserCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

export interface Courses {
  create(course: CreateCourseDto): Promise<Course>;
  findOne(id: FindOneCourseDto): Promise<Course | null>;
  findMany(ownerId: FindManyCourseDto): Promise<Array<Course>>;
  delete(id: FindOneCourseDto): Promise<Course>;
  update(course: UpdateCourseDto): Promise<Course>;
  findUserOfCourse(course_id: FindOneCourseDto): Promise<Course>;
  joinToCourse(joinUserCourseDto: JoinUserCourseDto): Promise<Course>;
  delteUserOfCourse(deleteCourseDto: DeleteCourseDto): Promise<User>;
}
