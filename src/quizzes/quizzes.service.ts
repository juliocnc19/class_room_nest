import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizzDto, CreateQuizzDto2 } from './dto/create-quiz.dto';
import { AnswerQuizzDto } from './dto/answer-quiz.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { errorResponse, successResponse } from 'src/utils/responseHttpUtils';

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

      return successResponse(quizz, 'Cuestionario creado exitosamente');
    } catch (error) {
      return errorResponse(
        'Error al crear el cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async createQuizz2(data: CreateQuizzDto2): Promise<any> {
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
  
      // Check if the course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
  
      if (!course) {
        return errorResponse('El curso no existe', HttpStatus.NOT_FOUND);
      }
  
      // Create the associated activity
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
  
      // Create questions and options
      const questionsData = questions.map((question) => ({
        text: question.text,
        options: question.options.map((option) => ({ text: option })),
        correctAnswerIndex: question.answer,
      }));
  
      const quizz = await this.prisma.quizz.create({
        data: {
          activity_id: activity.id,
          question: {
            create: questionsData.map((question) => {
              const options = question.options.map((opt, index) => ({
                text: opt.text,
                isCorrect: index === question.correctAnswerIndex,
              }));
  
              return {
                text: question.text,
                options: {
                  create: options,
                },
                answer: question.correctAnswerIndex + 1, // Save correct `optionId`
              };
            }),
          },
        },
      });
  
      // Notify users in the course about the quiz
      const users = await this.prisma.courseEnrollment.findMany({
        where: { courseId },
        include: { user: true },
      });
  
      const tokens = users
        .map((enrollment) => enrollment.user.firebaseToken)
        .filter((token) => token);
  
      if (tokens.length > 0) {
        await this.notificationsService.sendNotification({
          tokens,
          title: `Nuevo cuestionario en el curso ${course.title}`,
          body: `${title}: ${description}`,
          data: {
            courseId: courseId.toString(),
            activityId: activity.id.toString(),
            quizId: quizz.id.toString(),
          },
        });
      }
  
      // Fetch the complete quiz for response
      const completeQuiz = await this.prisma.quizz.findUnique({
        where: { id: quizz.id },
        include: {
          activity: true,
          question: {
            include: { options: true },
          },
        },
      });
  
      if (!completeQuiz) {
        return errorResponse(
          'No se encontró el cuestionario después de su creación',
          HttpStatus.NOT_FOUND,
        );
      }
  
      return successResponse(
        completeQuiz,
        'Cuestionario creado exitosamente con detalles completos',
      );
    } catch (error) {
      console.error('Error creating quiz:', error); // Log the error
      return errorResponse(
        'Error al crear el cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
  
  // async createQuizz2(data: CreateQuizzDto2): Promise<any> {
  //   try {
  //     const {
  //       title,
  //       description,
  //       grade,
  //       startDate,
  //       endDate,
  //       digital,
  //       statusId,
  //       courseId,
  //       questions,
  //       email,
  //     } = data;

  //     const course = await this.prisma.course.findUnique({
  //       where: { id: courseId },
  //     });

  //     if (!course) {
  //       return errorResponse('El curso no existe', HttpStatus.NOT_FOUND);
  //     }

  //     const activity = await this.prisma.activities.create({
  //       data: {
  //         title,
  //         description,
  //         grade,
  //         start_date: startDate,
  //         end_date: endDate,
  //         email,
  //         digital,
  //         isQuizz: true,
  //         status: { connect: { id: statusId } },
  //         course: { connect: { id: courseId } },
  //       },
  //     });

  //     const quizz = await this.prisma.quizz.create({
  //       data: {
  //         activity_id: activity.id,
  //         question: {
  //           create: questions.map((question) => ({
  //             text: question.text,
  //             answer: question.answer,
  //             options: {
  //               create: question.options.map((option) => ({ text: option })),
  //             },
  //           })),
  //         },
  //       },
  //     });

  //     const users = await this.prisma.courseEnrollment.findMany({
  //       where: { courseId },
  //       include: { user: true },
  //     });

  //     const tokens = users
  //       .map((enrollment) => enrollment.user.firebaseToken)
  //       .filter((token) => token);

  //     if (tokens.length > 0) {
  //       await this.notificationsService.sendNotification({
  //         tokens,
  //         title: `Nuevo cuestionario en el curso ${course.title}`,
  //         body: `${title}: ${description}`,
  //         data: {
  //           courseId: courseId.toString(),
  //           activityId: activity.id.toString(),
  //           quizId: quizz.id.toString(),
  //         },
  //       });
  //     }

  //     const completeQuiz = await this.prisma.quizz.findUnique({
  //       where: { id: quizz.id },
  //       include: {
  //         activity: true,
  //         question: {
  //           include: { options: true },
  //         },
  //       },
  //     });

  //     if (!completeQuiz) {
  //       return errorResponse(
  //         'No se encontró el cuestionario después de su creación',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     return successResponse(completeQuiz, 'Cuestionario creado exitosamente con detalles completos');
  //   } catch (error) {
  //     return errorResponse(
  //       'Error al crear el cuestionario',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       error,
  //     );
  //   }
  // }

  async answerQuizz(quizzId: number, data: AnswerQuizzDto): Promise<any> {
    try {
      const { userId, answers } = data;
  
      // Validate the user
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!userExists) {
        return errorResponse('El usuario no existe', HttpStatus.BAD_REQUEST);
      }
  
      // Fetch the quiz with questions and correct answers
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
        return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
      }
  
      const totalQuestions = quizz.question.length;
      let correctAnswers = 0;
  
      // Validate each user's answer against the correct answer
      quizz.question.forEach((question) => {
        const userAnswer = answers.find((ans) => ans.questionId === question.id)?.optionId;
  
        // Check if the user's selected option matches the correct option ID
        if (userAnswer === question.answer) {
          correctAnswers++;
        }
      });
  
      // Calculate the grade
      const grade = (correctAnswers / totalQuestions) * 100;
  
      // Create the quiz submission with the answers
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
        include: {
          answer: true, // Include the submitted answers in the result
        },
      });
  
      // If the quiz is associated with an activity, update the activity status
      if (quizz.activity) {
        await this.prisma.activitiesSent.create({
          data: {
            activity_id: quizz.activity.id,
            user_id: userId,
            grade,
            message: `Cuestionario respondido y calificado: ${grade.toFixed(2)}%`,
          },
        });
      }
  
      // Return the successful response
      return successResponse(
        {
          grade,
          submission: {
            id: submission.id,
            quizzId,
            userId,
            grade: grade.toFixed(2), // Convert grade to a string for consistency
            create_date: submission.create_date.toISOString(),
            answers: submission.answer.map((ans) => ({
              id: ans.id,
              optionId: ans.optionId,
            })),
          },
          quizz: {
            id: quizzId,
            activityId: quizz.activity.id,
            activity: {
              id: quizz.activity.id,
              courseId: quizz.activity.course_id,
              title: quizz.activity.title,
              description: quizz.activity.description,
              grade: quizz.activity.grade.toString(),
              startDate: quizz.activity.start_date,
              endDate: quizz.activity.end_date,
              email: quizz.activity.email,
              digital: quizz.activity.digital,
              isQuizz: quizz.activity.isQuizz,
              statusId: quizz.activity.status_id,
            },
            question: quizz.question.map((q) => ({
              id: q.id,
              quizzId: q.quizzId,
              text: q.text,
              answer: q.answer, // Include the correct answer for debugging (optional)
              options: q.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
                questionId: opt.questionId,
              })),
            })),
            title: quizz.activity.title,
            description: quizz.activity.description,
            totalQuestions: quizz.question.length,
          },
        },
        'Respuestas enviadas exitosamente',
      );
    } catch (error) {
      console.error('Error submitting quiz:', error); // Log error for debugging
      return errorResponse(
        'Error al enviar las respuestas del cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  // async answerQuizz(quizzId: number, data: AnswerQuizzDto) {
  //   try {
  //     const { userId, answers } = data;

  //     const quizz = await this.prisma.quizz.findUnique({
  //       where: { id: quizzId },
  //       include: {
  //         question: {
  //           include: { options: true },
  //         },
  //         activity: true,
  //       },
  //     });

  //     if (!quizz) {
  //       return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
  //     }

  //     const totalQuestions = quizz.question.length;
  //     let correctAnswers = 0;

  //     quizz.question.forEach((question) => {
  //       const userAnswer = answers.find(
  //         (ans) => ans.questionId === question.id,
  //       )?.optionId;
  //       if (userAnswer === question.answer) {
  //         correctAnswers++;
  //       }
  //     });

  //     const grade = (correctAnswers / totalQuestions) * 100;

  //     const submission = await this.prisma.quizzSent.create({
  //       data: {
  //         quizzId,
  //         userId,
  //         grade,
  //         answer: {
  //           create: answers.map((answer) => ({
  //             optionId: answer.optionId,
  //           })),
  //         },
  //       },
  //     });

  //     if (quizz.activity) {
  //       await this.prisma.activitiesSent.create({
  //         data: {
  //           activity_id: quizz.activity.id,
  //           user_id: userId,
  //           grade,
  //           message: `Cuestionario respondido y calificado: ${grade.toFixed(2)}%`,
  //         },
  //       });
  //     }

  //     return successResponse({ grade, submission }, 'Respuestas enviadas exitosamente');
  //   } catch (error) {
  //     return errorResponse(
  //       'Error al enviar las respuestas del cuestionario',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       error,
  //     );
  //   }
  // }

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
        return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
      }

      return successResponse(quizz, 'Cuestionario obtenido exitosamente');
    } catch (error) {
      return errorResponse(
        'Error al obtener el cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
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
        return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
      }

      if (quizz.activity) {
        await this.prisma.activities.delete({
          where: { id: quizz.activity.id },
        });
      }

      await this.prisma.quizz.delete({
        where: { id },
      });

      return successResponse(null, 'Cuestionario y actividad asociada eliminados exitosamente');
    } catch (error) {
      return errorResponse(
        'Error al eliminar el cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  // async createQuizz(data: CreateQuizzDto) {
  //   try {
  //     const { activityId, questions } = data;

  //     const quizz = await this.prisma.quizz.create({
  //       data: {
  //         activity_id: activityId,
  //         question: {
  //           create: questions.map((question) => ({
  //             text: question.text,
  //             answer: question.answer,
  //             options: {
  //               create: question.options.map((option) => ({ text: option })),
  //             },
  //           })),
  //         },
  //       },
  //     });

  //     return quizz;
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Failed to create quiz',
  //         data: { error: error.message },
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async createQuizz2(data: CreateQuizzDto2): Promise<CompleteQuizResponse> {
  //   try {
  //     const {
  //       title,
  //       description,
  //       grade,
  //       startDate,
  //       endDate,
  //       digital,
  //       statusId,
  //       courseId,
  //       questions,
  //       email,
  //     } = data;

  //     // Verify the Course exists
  //     const course = await this.prisma.course.findUnique({
  //       where: { id: courseId },
  //     });

  //     if (!course) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Course not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     // Create the activity
  //     const activity = await this.prisma.activities.create({
  //       data: {
  //         title,
  //         description,
  //         grade,
  //         start_date: startDate,
  //         end_date: endDate,
  //         email,
  //         digital,
  //         isQuizz: true,
  //         status: { connect: { id: statusId } },
  //         course: { connect: { id: courseId } },
  //       },
  //     });

  //     // Create the quiz associated with the activity
  //     const quizz = await this.prisma.quizz.create({
  //       data: {
  //         activity_id: activity.id,
  //         question: {
  //           create: questions.map((question) => ({
  //             text: question.text,
  //             answer: question.answer,
  //             options: {
  //               create: question.options.map((option) => ({ text: option })),
  //             },
  //           })),
  //         },
  //       },
  //     });

  //     // Fetch all users related to the course except the specified userId
  //     const users = await this.prisma.courseEnrollment.findMany({
  //       where: {
  //         courseId,
  //       },
  //       include: {
  //         user: true, // Include user details to get firebaseToken
  //       },
  //     });

  //     // Collect valid Firebase tokens
  //     const tokens = users
  //       .map((enrollment) => enrollment.user.firebaseToken)
  //       .filter((token) => token); // Exclude null or empty tokens

  //     if (tokens.length > 0) {
  //       // Send notification
  //       const notificationTitle = `New quiz in course ${course.title}`;
  //       const notificationBody = `${title}: ${description}`;
  //       await this.notificationsService.sendNotification({
  //         tokens,
  //         title: notificationTitle,
  //         body: notificationBody,
  //         data: {
  //           courseId: courseId.toString(),
  //           activityId: activity.id.toString(),
  //           quizId: quizz.id.toString(),
  //         },
  //       });
  //     }

  //     // Fetch the complete quiz details
  //     const completeQuiz = await this.prisma.quizz.findUnique({
  //       where: { id: quizz.id },
  //       include: {
  //         activity: true,
  //         question: {
  //           include: {
  //             options: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!completeQuiz) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Quiz not found after creation',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     return {
  //       id: completeQuiz.id,
  //       activity_id: completeQuiz.activity_id,
  //       activity: {
  //         id: completeQuiz.activity.id,
  //         title: completeQuiz.activity.title,
  //         description: completeQuiz.activity.description,
  //         grade: parseFloat(completeQuiz.activity.grade.toString()),
  //         start_date: completeQuiz.activity.start_date,
  //         end_date: completeQuiz.activity.end_date,
  //         email: completeQuiz.activity.email,
  //         digital: completeQuiz.activity.digital,
  //         isQuizz: completeQuiz.activity.isQuizz,
  //       },
  //       question: completeQuiz.question.map((q) => ({
  //         id: q.id,
  //         text: q.text,
  //         answer: q.answer,
  //         options: q.options.map((opt) => ({
  //           id: opt.id,
  //           text: opt.text,
  //         })),
  //       })),
  //       quizzId: completeQuiz.id,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Failed to create quiz',
  //         data: { error: error.message },
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async answerQuizz(quizzId: number, data: AnswerQuizzDto) {
  //   try {
  //     const { userId, answers } = data;

  //     const quizz = await this.prisma.quizz.findUnique({
  //       where: { id: quizzId },
  //       include: {
  //         question: {
  //           include: { options: true },
  //         },
  //         activity: true,
  //       },
  //     });

  //     if (!quizz) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Quiz not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     const totalQuestions = quizz.question.length;
  //     let correctAnswers = 0;

  //     quizz.question.forEach((question) => {
  //       const userAnswer = answers.find(
  //         (ans) => ans.questionId === question.id,
  //       )?.optionId;
  //       if (userAnswer === question.answer) {
  //         correctAnswers++;
  //       }
  //     });

  //     const grade = (correctAnswers / totalQuestions) * 100;

  //     // Save user's submission
  //     const submission = await this.prisma.quizzSent.create({
  //       data: {
  //         quizzId,
  //         userId,
  //         grade,
  //         answer: {
  //           create: answers.map((answer) => ({
  //             optionId: answer.optionId,
  //           })),
  //         },
  //       },
  //     });

  //     // Save the activity in ActivitiesSent
  //     if (quizz.activity) {
  //       await this.prisma.activitiesSent.create({
  //         data: {
  //           activity_id: quizz.activity.id,
  //           user_id: userId,
  //           grade,
  //           message: `Quiz answered and graded: ${grade.toFixed(2)}%`,
  //         },
  //       });
  //     }

  //     return {
  //       grade,
  //       submission,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Failed to submit quiz answers',
  //         data: { error: error.message },
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async getQuizz(id: number) {
  //   try {
  //     const quizz = await this.prisma.quizz.findUnique({
  //       where: { id },
  //       include: {
  //         activity: true,
  //         question: {
  //           include: { options: true },
  //         },
  //       },
  //     });

  //     if (!quizz) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Quiz not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     return {
  //       id: quizz.id,
  //       activity: quizz.activity,
  //       questions: quizz.question.map((q) => ({
  //         id: q.id,
  //         text: q.text,
  //         answer: q.answer,
  //         options: q.options.map((o) => ({ id: o.id, text: o.text })),
  //       })),
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Failed to retrieve quiz',
  //         data: { error: error.message },
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async deleteQuizz(id: number) {
  //   try {
  //     const quizz = await this.prisma.quizz.findUnique({
  //       where: { id },
  //       include: { activity: true },
  //     });

  //     if (!quizz) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.NOT_FOUND,
  //           message: 'Quiz not found',
  //           data: {},
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     // Delete associated activity
  //     if (quizz.activity) {
  //       await this.prisma.activities.delete({
  //         where: { id: quizz.activity.id },
  //       });
  //     }

  //     // Delete the quiz
  //     await this.prisma.quizz.delete({
  //       where: { id },
  //     });

  //     return {
  //       message: 'Quiz and associated activity deleted successfully',
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Failed to delete quiz',
  //         data: { error: error.message },
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
