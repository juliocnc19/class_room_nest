import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

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
  ownerId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  areaId: number;
}

export class JoinUserCourseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class UpdateCourseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  ownerId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  areaId?: number;
}

export class DeleteCourseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  idUser: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  idCourse: number;
}

export class ChangeStatusCourseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
