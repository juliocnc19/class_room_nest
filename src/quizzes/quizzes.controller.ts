import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizzDto, CreateQuizzDto2 } from './dto/create-quiz.dto';
import { AnswerQuizzDto } from './dto/answer-quiz.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { errorResponse } from 'src/utils/responseHttpUtils';

@ApiTags('Quizzes') // Groups endpoints under "Quizzes" in Swagger
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Quiz created successfully',
  })
  @Post()
  async create(@Body() createQuizzDto: CreateQuizzDto) {
    return this.quizzesService.createQuizz(createQuizzDto);
  }

  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Quiz created successfully',
  })
  @Post("/new")
  async createQuizz(@Body() createQuizzDto: CreateQuizzDto2) {
    return await this.quizzesService.createQuizz2(createQuizzDto);

  }

  @ApiOperation({ summary: 'Submit answers for a quiz and grade them' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz answered and graded successfully',
  })
  @Post(':id/answer')
async answer(
  @Param('id') id: string, // Receive `id` as a string to ensure it's parsed correctly
  @Body() answerQuizzDto: AnswerQuizzDto,
) {
  const quizzId = parseInt(id, 10); // Convert the `id` to a number explicitly
  if (isNaN(quizzId)) {
    return errorResponse('El ID del cuestionario debe ser un número', HttpStatus.BAD_REQUEST);
  }
  return this.quizzesService.answerQuizz(quizzId, answerQuizzDto);
}
  // @Post(':id/answer')
  // async answer(
  //   @Param('id') id: number,
  //   @Body() answerQuizzDto: AnswerQuizzDto,
  // ) {
  //   return this.quizzesService.answerQuizz(id, answerQuizzDto);
 
  // }

  @ApiOperation({ summary: 'Retrieve a specific quiz' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz retrieved successfully',
  })
  @Get(':id')
  async getQuizz(@Param('id') id: number) {
    return this.quizzesService.getQuizz(id);
   
  }

  @ApiOperation({ summary: 'Delete a specific quiz' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz deleted successfully',
  })
  @Delete(':id')
  async deleteQuizz(@Param('id') id: number) {
    return this.quizzesService.deleteQuizz(id);
  
  }
}

