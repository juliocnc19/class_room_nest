import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

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
