import { IsInt, IsArray, IsString, ValidateNested } from 'class-validator';
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