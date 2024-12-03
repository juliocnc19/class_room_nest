import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizzDto, CreateQuizzDto2 } from './dto/create-quiz.dto';
import { AnswerQuizzDto } from './dto/answer-quiz.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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

  async createQuizz2(data: CreateQuizzDto2): Promise<CompleteQuizResponse> {
    try {
      const {
        title,
        description,
        grade,
        startDate,
        endDate,
        digital,
        statusId,
        courseId,
        questions,
        email,
      } = data;

      // Verify the Course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Create the activity
      const activity = await this.prisma.activities.create({
        data: {
          title,
          description,
          grade,
          start_date: startDate,
          end_date: endDate,
          email,
          digital,
          isQuizz: true,
          status: { connect: { id: statusId } },
          course: { connect: { id: courseId } },
        },
      });

      // Create the quiz associated with the activity
      const quizz = await this.prisma.quizz.create({
        data: {
          activity_id: activity.id,
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

      // Fetch all users related to the course except the specified userId
      const users = await this.prisma.courseEnrollment.findMany({
        where: {
          courseId,
        },
        include: {
          user: true, // Include user details to get firebaseToken
        },
      });

      // Collect valid Firebase tokens
      const tokens = users
        .map((enrollment) => enrollment.user.firebaseToken)
        .filter((token) => token); // Exclude null or empty tokens

      if (tokens.length > 0) {
        // Send notification
        const notificationTitle = `New quiz in course ${course.title}`;
        const notificationBody = `${title}: ${description}`;
        await this.notificationsService.sendNotification({
          tokens,
          title: notificationTitle,
          body: notificationBody,
          data: {
            courseId: courseId.toString(),
            activityId: activity.id.toString(),
            quizId: quizz.id.toString(),
          },
        });
      }

      // Fetch the complete quiz details
      const completeQuiz = await this.prisma.quizz.findUnique({
        where: { id: quizz.id },
        include: {
          activity: true,
          question: {
            include: {
              options: true,
            },
          },
        },
      });

      if (!completeQuiz) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Quiz not found after creation',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        id: completeQuiz.id,
        activity_id: completeQuiz.activity_id,
        activity: {
          id: completeQuiz.activity.id,
          title: completeQuiz.activity.title,
          description: completeQuiz.activity.description,
          grade: parseFloat(completeQuiz.activity.grade.toString()),
          start_date: completeQuiz.activity.start_date,
          end_date: completeQuiz.activity.end_date,
          email: completeQuiz.activity.email,
          digital: completeQuiz.activity.digital,
          isQuizz: completeQuiz.activity.isQuizz,
        },
        question: completeQuiz.question.map((q) => ({
          id: q.id,
          text: q.text,
          answer: q.answer,
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          })),
        })),
        quizzId: completeQuiz.id,
      };
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

      const quizz = await this.prisma.quizz.findUnique({
        where: { id: quizzId },
        include: {
          question: {
            include: { options: true },
          },
          activity: true,
        },
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

      // Save the activity in ActivitiesSent
      if (quizz.activity) {
        await this.prisma.activitiesSent.create({
          data: {
            activity_id: quizz.activity.id,
            user_id: userId,
            grade,
            message: `Quiz answered and graded: ${grade.toFixed(2)}%`,
          },
        });
      }

      return {
        grade,
        submission,
      };
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
        include: {
          activity: true,
          question: {
            include: { options: true },
          },
        },
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

      return {
        id: quizz.id,
        activity: quizz.activity,
        questions: quizz.question.map((q) => ({
          id: q.id,
          text: q.text,
          answer: q.answer,
          options: q.options.map((o) => ({ id: o.id, text: o.text })),
        })),
      };
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
        include: { activity: true },
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

      // Delete associated activity
      if (quizz.activity) {
        await this.prisma.activities.delete({
          where: { id: quizz.activity.id },
        });
      }

      // Delete the quiz
      await this.prisma.quizz.delete({
        where: { id },
      });

      return {
        message: 'Quiz and associated activity deleted successfully',
      };
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
