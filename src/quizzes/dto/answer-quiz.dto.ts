import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty({ description: 'The ID of the question', example: 1 })
  @IsInt()
  questionId: number;

  @ApiProperty({ description: 'The ID of the selected option', example: 3 })
  @IsInt()
  optionId: number;
}

export class AnswerQuizzDto {
  @ApiProperty({ description: 'The ID of the user submitting the answers', example: 2 })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The list of answers for the quiz',
    type: [AnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}