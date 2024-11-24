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
    const quizz = await this.quizzesService.createQuizz(createQuizzDto);
    return {
      code: HttpStatus.CREATED,
      message: 'Quiz created successfully',
      data: quizz,
    };
  }

  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Quiz created successfully',
  })
  @Post("/new")
  async createQuizz(@Body() createQuizzDto: CreateQuizzDto2) {
    const quizz = await this.quizzesService.createQuizz2(createQuizzDto);
    return {
      code: HttpStatus.CREATED,
      message: 'Quiz created successfully',
      data: quizz,
    };
  }

  @ApiOperation({ summary: 'Submit answers for a quiz and grade them' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz answered and graded successfully',
  })
  @Post(':id/answer')
  async answer(
    @Param('id') id: number,
    @Body() answerQuizzDto: AnswerQuizzDto,
  ) {
    const result = await this.quizzesService.answerQuizz(id, answerQuizzDto);
    return {
      code: HttpStatus.OK,
      message: 'Quiz answered and graded successfully',
      data: result,
    };
  }

  @ApiOperation({ summary: 'Retrieve a specific quiz' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz retrieved successfully',
  })
  @Get(':id')
  async getQuizz(@Param('id') id: number) {
    const quizz = await this.quizzesService.getQuizz(id);
    return {
      code: HttpStatus.OK,
      message: 'Quiz retrieved successfully',
      data: quizz,
    };
  }

  @ApiOperation({ summary: 'Delete a specific quiz' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz deleted successfully',
  })
  @Delete(':id')
  async deleteQuizz(@Param('id') id: number) {
    const data = await this.quizzesService.deleteQuizz(id);
    return {
      code: HttpStatus.OK,
      message: 'Quiz deleted successfully',
      data: data,
    };
  }
}

