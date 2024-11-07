import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateActivitiesDto {
  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  grade: number;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  end_date: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsNotEmpty()
  status_id: number;
}

export class FindOneActivitiesDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class FindManyActivitiesDto {
  @IsInt()
  @IsNotEmpty()
  course_id: number;
}

export class UpdateActivitiesDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsOptional()
  grade: number;

  @IsString()
  @IsOptional()
  start_date: string;

  @IsString()
  @IsOptional()
  end_date: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsInt()
  @IsOptional()
  status_id: number;
}

export class FindActivitiesForUserDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class FindActivitiesForEvaluationDto {
  @IsInt()
  @IsNotEmpty()
  id_activity: number;
}
