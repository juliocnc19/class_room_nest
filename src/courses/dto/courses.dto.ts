import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  token: string;

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

export class FindOneCourseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class FindManyCourseDto {
  @IsInt()
  @IsNotEmpty()
  ownerId: number;
}

export class JoinUserCourseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class UpdateCourseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

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

export class DeleteCourseDto {
  @IsInt()
  @IsNotEmpty()
  idUser: number;

  @IsInt()
  @IsNotEmpty()
  idCourse: number;
}
