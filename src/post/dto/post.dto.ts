import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  file: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}
