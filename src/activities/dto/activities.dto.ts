import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateActivitiesDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  grade: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  ponderacion: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @ApiProperty({ description: 'Digital activity flag', example: true })
  // @IsBoolean()
  // digital: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  status_id: number;
}

export class FindOneActivitiesDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class FindManyActivitiesDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  course_id: number;
}

export class UpdateActivitiesDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  grade: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  ponderacion: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  end_date: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  status_id: number;
}

export class FindActivitiesForUserDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class FindActivitiesForEvaluationDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_activity: number;
}

export class SendActivityDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  activity_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  document: string;
}

export class ActivitiesSendForStudenInCourse {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  course_id: number;
}

export class AssessActivityDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  grade: number;
}
