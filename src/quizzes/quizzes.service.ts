import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizzDto } from './dto/create-quiz.dto';
import { AnswerQuizzDto } from './dto/answer-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuizz(data: CreateQuizzDto) {
    try {
      const { activityId, questions } = data;

      const quizz = await this.prisma.quizz.create({
        data: {
          activity_id: activityId,
          question: {
            create: questions.map((question) => ({
              text: question.text,
              answer: question.answer,
              options: {
                create: question.options.map((option) => ({ text: option })),
              },
            })),
          },
        },
      });

      return quizz;
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create quiz',
          data: { error: error.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async answerQuizz(quizzId: number, data: AnswerQuizzDto) {
    try {
      const { userId, answers } = data;

      // Fetch the quiz questions and correct answers
      const quizz = await this.prisma.quizz.findUnique({
        where: { id: quizzId },
        include: { question: true },
      });

      if (!quizz) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Quiz not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Calculate grade
      const totalQuestions = quizz.question.length;
      let correctAnswers = 0;

      quizz.question.forEach((question) => {
        const userAnswer = answers.find(
          (ans) => ans.questionId === question.id,
        )?.optionId;
        if (userAnswer === question.answer) {
          correctAnswers++;
        }
      });

      const grade = (correctAnswers / totalQuestions) * 100;

      // Save user's submission
      const submission = await this.prisma.quizzSent.create({
        data: {
          quizzId,
          userId,
          grade,
          answer: {
            create: answers.map((answer) => ({
              optionId: answer.optionId,
            })),
          },
        },
      });

      return { grade, submission };
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to submit quiz answers',
          data: { error: error.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuizz(id: number) {
    try {
      const quizz = await this.prisma.quizz.findUnique({
        where: { id },
        include: { question: { include: { options: true } } },
      });

      if (!quizz) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Quiz not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return quizz;
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve quiz',
          data: { error: error.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteQuizz(id: number) {
    try {
      const quizz = await this.prisma.quizz.findUnique({
        where: { id },
      });

      if (!quizz) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Quiz not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.quizz.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete quiz',
          data: { error: error.message },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
