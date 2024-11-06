import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsDecimal } from 'class-validator';

export class CreateCourseDto implements Prisma.CourseCreateInput {
    verified?: boolean;
    token: string;
    owner: Prisma.UserCreateNestedOneWithoutCourse_ownerInput;
    area: Prisma.AreaCreateNestedOneWithoutCourseInput;
    users?: Prisma.CourseEnrollmentCreateNestedManyWithoutCourseInput;
    activities?: Prisma.ActivitiesCreateNestedManyWithoutCourseInput;
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsInt()
    @IsNotEmpty()
    ownerId: number;
  
    @IsString()
    @IsNotEmpty()
    owner_name: string;
  
    @IsString()
    @IsNotEmpty()
    section: string;
  
    @IsString()
    @IsNotEmpty()
    subject: string;
  
    @IsInt()
    @IsNotEmpty()
    areaId: number;
  }
  
  export class UpdateCourseDto implements Prisma.CourseUpdateInput {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsString()
    @IsOptional()
    section?: string;
  
    @IsString()
    @IsOptional()
    subject?: string;
  
    @IsInt()
    @IsOptional()
    ownerId?: number;
  
    @IsInt()
    @IsOptional()
    areaId?: number;
  }