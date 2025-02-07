import { IsInt, IsArray, IsString, ValidateNested, IsDecimal, IsBoolean, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class QuestionDto {
  @ApiProperty({ description: 'The question text', example: 'What is the capital of France?' })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The options for the question',
    example: ['Paris', 'London', 'Berlin', 'Madrid'],
  })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ description: 'The index of the correct answer (0-based)', example: 0 })
  @IsInt()
  answer: number;
}

export class CreateQuizzDto {
  @ApiProperty({ description: 'The ID of the associated activity', example: 1 })
  @IsInt()
  activityId: number;

  @ApiProperty({
    description: 'The list of questions for the quiz',
    type: [QuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}



class QuestionDto2 {
  @ApiProperty({ description: 'The question text', example: 'What is the capital of France?' })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The options for the question',
    example: ['Paris', 'London', 'Berlin', 'Madrid'],
  })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ description: 'The index of the correct answer (0-based)', example: 0 })
  @IsInt()
  answer: number;
}

export class CreateQuizzDto2 {
  @ApiProperty({ description: 'Title for the associated activity', example: 'Quiz 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description for the activity', example: 'Chapter 1 Quiz' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Grade for the activity', example: 10.0 })
  @IsDecimal()
  @IsNotEmpty()
  grade: number;

  @ApiProperty({ description: 'Ponderacion for the quizz', example: '10' })
  @IsInt()
  @IsNotEmpty()
  ponderacion: number;

  @ApiProperty({ description: 'Start date for the activity', example: '2024-12-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for the activity', example: '2024-12-10' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Digital activity flag', example: true })
  @IsBoolean()
  @IsNotEmpty()
  digital: boolean;

  @ApiProperty({ description: 'Status ID for the activity', example: 1 })
  @IsInt()
  statusId: number;

  @ApiProperty({
    description: 'The course ID associated with the activity',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({
    description: 'The list of questions for the quiz',
    type: [QuestionDto2],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto2)
  questions: QuestionDto2[];
}
