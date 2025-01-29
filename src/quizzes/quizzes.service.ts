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
        options: question.options.map((option, index) => ({
          text: option,
        })),
        answer: question.answer, // Store the index of the correct answer
      }));
  
      const quizz = await this.prisma.quizz.create({
        data: {
          activity_id: activity.id,
          question: {
            create: questionsData.map((question) => {
              const options = question.options.map((opt, index) => ({
                text: opt.text,
              }));
  
              return {
                text: question.text,
                options: {
                  create: options,
                },
                answer: question.answer + 1, // Store the correct `optionId` (answer + 1)
              };
            }),
          },
        },
      });
  
      // **Create a post for the quiz**
      await this.prisma.post.create({
        data: {
          title: `Nuevo cuestionario: ${title}`,
          content: description,
          courseId: courseId,
          activityId: activity.id,
          authorId: course.ownerId,
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
          activity: {
            include:  {
              Post: true,
              quizz: true
            }
          },
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
  
  //     // Check if the course exists
  //     const course = await this.prisma.course.findUnique({
  //       where: { id: courseId },
  //     });
  
  //     if (!course) {
  //       return errorResponse('El curso no existe', HttpStatus.NOT_FOUND);
  //     }
  
  //     // Create the associated activity
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
  
  //     // Create questions and options
  //     const questionsData = questions.map((question) => ({
  //       text: question.text,
  //       options: question.options.map((option, index) => ({
  //         text: option,
  //       })),
  //       answer: question.answer, // Store the index of the correct answer
  //     }));
  
  //     const quizz = await this.prisma.quizz.create({
  //       data: {
  //         activity_id: activity.id,
  //         question: {
  //           create: questionsData.map((question) => {
  //             const options = question.options.map((opt, index) => ({
  //               text: opt.text,
  //             }));
  
  //             return {
  //               text: question.text,
  //               options: {
  //                 create: options,
  //               },
  //               answer: question.answer + 1, // Store the correct `optionId` (answer + 1)
  //             };
  //           }),
  //         },
  //       },
  //     });
  
  //     // Notify users in the course about the quiz
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
  
  //     // Fetch the complete quiz for response
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
  
  //     return successResponse(
  //       completeQuiz,
  //       'Cuestionario creado exitosamente con detalles completos',
  //     );
  //   } catch (error) {
  //     console.error('Error creating quiz:', error); // Log the error
  //     return errorResponse(
  //       'Error al crear el cuestionario',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       error.message,
  //     );
  //   }
  // }
  
  async answerQuizz(quizzId: number, data: AnswerQuizzDto): Promise<any> {
    try {
      const { userId, answers } = data;
  
      console.log('Received Quiz ID:', quizzId);
      console.log('Received User ID:', userId);
      console.log('Received Answers:', JSON.stringify(answers, null, 2));
  
      // Validate the user
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!userExists) {
        console.error('User not found');
        return errorResponse('El usuario no existe', HttpStatus.BAD_REQUEST);
      }
  
      console.log('User exists:', userExists);
  
      // Validate that the user has not already submitted this quiz
      const existingSubmission = await this.prisma.quizzSent.findFirst({
        where: {
          quizzId,
          userId,
        },
      });
  
      if (existingSubmission) {
        console.error('Quiz already submitted by user');
        return errorResponse('Ya has enviado este cuestionario', HttpStatus.BAD_REQUEST);
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
        console.error('Quiz not found');
        return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
      }
  
      console.log('Fetched Quiz:', JSON.stringify(quizz, null, 2));
  
      const totalQuestions = quizz.question.length;
      let correctAnswers = 0;
  
      // Validate each user's answer against the correct answer
      quizz.question.forEach((question) => {
        const userAnswer = answers.find((ans) => ans.questionId === question.id)?.optionId;
  
        console.log('Checking Question:', question.text);
        console.log('User Answer (optionId):', userAnswer);
  
        // Map the correct answer index to the corresponding optionId
        const correctOptionId = question.options[question.answer - 1]?.id; // Convert 1-based index to 0-based and get optionId
  
        console.log('Correct Option ID:', correctOptionId);
  
        // Check if the user's selected option matches the correct option ID
        if (userAnswer === correctOptionId) {
          correctAnswers++;
          console.log('Answer is correct');
        } else {
          console.log('Answer is incorrect');
        }
      });
  
      console.log('Correct Answers:', correctAnswers, 'out of', totalQuestions);
  
      // Calculate the grade
      const grade = (correctAnswers / totalQuestions) * 100;
      console.log('Calculated Grade:', grade);
  
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
          answer: true,
        },
      });
  
      console.log('Quiz Submission Created:', JSON.stringify(submission, null, 2));
  
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
        console.log('Activity status updated');
      }
  
      // Return the successful response
      return successResponse(
        {
          grade,
          submission: {
            id: submission.id,
            quizzId,
            userId,
            grade: grade.toFixed(2),
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
      console.error('Error submitting quiz:', error);
      return errorResponse(
        'Error al enviar las respuestas del cuestionario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
  
  // async answerQuizz(quizzId: number, data: AnswerQuizzDto): Promise<any> {
  //   try {
  //     const { userId, answers } = data;
  
  //     console.log('Received Quiz ID:', quizzId);
  //     console.log('Received User ID:', userId);
  //     console.log('Received Answers:', JSON.stringify(answers, null, 2));
  
  //     // Validate the user
  //     const userExists = await this.prisma.user.findUnique({
  //       where: { id: userId },
  //     });
  
  //     if (!userExists) {
  //       console.error('User not found');
  //       return errorResponse('El usuario no existe', HttpStatus.BAD_REQUEST);
  //     }
  
  //     console.log('User exists:', userExists);
  
  //     // Fetch the quiz with questions and correct answers
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
  //       console.error('Quiz not found');
  //       return errorResponse('El cuestionario no existe', HttpStatus.NOT_FOUND);
  //     }
  
  //     console.log('Fetched Quiz:', JSON.stringify(quizz, null, 2));
  
  //     const totalQuestions = quizz.question.length;
  //     let correctAnswers = 0;
  
  //     // Validate each user's answer against the correct answer
  //     quizz.question.forEach((question) => {
  //       const userAnswer = answers.find((ans) => ans.questionId === question.id)?.optionId;
      
  //       console.log('Checking Question:', question.text);
  //       console.log('User Answer (optionId):', userAnswer);
      
  //       // Map the correct answer index to the corresponding optionId
  //       const correctOptionId = question.options[question.answer - 1]?.id; // Convert 1-based index to 0-based and get optionId
      
  //       console.log('Correct Option ID:', correctOptionId);
      
  //       // Check if the user's selected option matches the correct option ID
  //       if (userAnswer === correctOptionId) {
  //         correctAnswers++;
  //         console.log('Answer is correct');
  //       } else {
  //         console.log('Answer is incorrect');
  //       }
  //     });
  //     // quizz.question.forEach((question) => {
  //     //   const userAnswer = answers.find((ans) => ans.questionId === question.id)?.optionId;
  
  //     //   console.log('Checking Question:', question.text);
  //     //   console.log('Checking Answer:', question.answer);

  //     //   console.log('User Answer:', userAnswer);
  //     //   console.log('Correct Answer:', question.answer);
  
  //     //   // Check if the user's selected option matches the correct option ID
  //     //   if (userAnswer === question.answer) {
  //     //     correctAnswers++;
  //     //     console.log('Answer is correct');
  //     //   } else {
  //     //     console.log('Answer is incorrect');
  //     //   }
  //     // });
  
  //     console.log('Correct Answers:', correctAnswers, 'out of', totalQuestions);
  
  //     // Calculate the grade
  //     const grade = (correctAnswers / totalQuestions) * 100;
  //     console.log('Calculated Grade:', grade);
  
  //     // Create the quiz submission with the answers
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
  //       include: {
  //         answer: true,
  //       },
  //     });
  
  //     console.log('Quiz Submission Created:', JSON.stringify(submission, null, 2));
  
  //     // If the quiz is associated with an activity, update the activity status
  //     if (quizz.activity) {
  //       await this.prisma.activitiesSent.create({
  //         data: {
  //           activity_id: quizz.activity.id,
  //           user_id: userId,
  //           grade,
  //           message: `Cuestionario respondido y calificado: ${grade.toFixed(2)}%`,
  //         },
  //       });
  //       console.log('Activity status updated');
  //     }
  
  //     // Return the successful response
  //     return successResponse(
  //       {
  //         grade,
  //         submission: {
  //           id: submission.id,
  //           quizzId,
  //           userId,
  //           grade: grade.toFixed(2),
  //           create_date: submission.create_date.toISOString(),
  //           answers: submission.answer.map((ans) => ({
  //             id: ans.id,
  //             optionId: ans.optionId,
  //           })),
  //         },
  //         quizz: {
  //           id: quizzId,
  //           activityId: quizz.activity.id,
  //           activity: {
  //             id: quizz.activity.id,
  //             courseId: quizz.activity.course_id,
  //             title: quizz.activity.title,
  //             description: quizz.activity.description,
  //             grade: quizz.activity.grade.toString(),
  //             startDate: quizz.activity.start_date,
  //             endDate: quizz.activity.end_date,
  //             email: quizz.activity.email,
  //             digital: quizz.activity.digital,
  //             isQuizz: quizz.activity.isQuizz,
  //             statusId: quizz.activity.status_id,
  //           },
  //           question: quizz.question.map((q) => ({
  //             id: q.id,
  //             quizzId: q.quizzId,
  //             text: q.text,
  //             answer: q.answer, // Include the correct answer for debugging (optional)
  //             options: q.options.map((opt) => ({
  //               id: opt.id,
  //               text: opt.text,
  //               questionId: opt.questionId,
  //             })),
  //           })),
  //           title: quizz.activity.title,
  //           description: quizz.activity.description,
  //           totalQuestions: quizz.question.length,
  //         },
  //       },
  //       'Respuestas enviadas exitosamente',
  //     );
  //   } catch (error) {
  //     console.error('Error submitting quiz:', error);
  //     return errorResponse(
  //       'Error al enviar las respuestas del cuestionario',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       error.message,
  //     );
  //   }
  // }
  

  // async answerQuizz(quizzId: number, data: AnswerQuizzDto): Promise<any> {
  //   try {
  //     const { userId, answers } = data;
  
  //     // Validate the user
  //     const userExists = await this.prisma.user.findUnique({
  //       where: { id: userId },
  //     });
  
  //     if (!userExists) {
  //       return errorResponse('El usuario no existe', HttpStatus.BAD_REQUEST);
  //     }
  
  //     // Fetch the quiz with questions and correct answers
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
  
  //     // Validate each user's answer against the correct answer
  //     quizz.question.forEach((question) => {
  //       const userAnswer = answers.find((ans) => ans.questionId === question.id)?.optionId;
  
  //       // Check if the user's selected option matches the correct option ID
  //       if (userAnswer === question.answer) {
  //         correctAnswers++;
  //       }
  //     });
  
  //     // Calculate the grade
  //     const grade = (correctAnswers / totalQuestions) * 100;
  
  //     // Create the quiz submission with the answers
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
  //       include: {
  //         answer: true, // Include the submitted answers in the result
  //       },
  //     });
  
  //     // If the quiz is associated with an activity, update the activity status
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
  
  //     // Return the successful response
  //     return successResponse(
  //       {
  //         grade,
  //         submission: {
  //           id: submission.id,
  //           quizzId,
  //           userId,
  //           grade: grade.toFixed(2), // Convert grade to a string for consistency
  //           create_date: submission.create_date.toISOString(),
  //           answers: submission.answer.map((ans) => ({
  //             id: ans.id,
  //             optionId: ans.optionId,
  //           })),
  //         },
  //         quizz: {
  //           id: quizzId,
  //           activityId: quizz.activity.id,
  //           activity: {
  //             id: quizz.activity.id,
  //             courseId: quizz.activity.course_id,
  //             title: quizz.activity.title,
  //             description: quizz.activity.description,
  //             grade: quizz.activity.grade.toString(),
  //             startDate: quizz.activity.start_date,
  //             endDate: quizz.activity.end_date,
  //             email: quizz.activity.email,
  //             digital: quizz.activity.digital,
  //             isQuizz: quizz.activity.isQuizz,
  //             statusId: quizz.activity.status_id,
  //           },
  //           question: quizz.question.map((q) => ({
  //             id: q.id,
  //             quizzId: q.quizzId,
  //             text: q.text,
  //             answer: q.answer, // Include the correct answer for debugging (optional)
  //             options: q.options.map((opt) => ({
  //               id: opt.id,
  //               text: opt.text,
  //               questionId: opt.questionId,
  //             })),
  //           })),
  //           title: quizz.activity.title,
  //           description: quizz.activity.description,
  //           totalQuestions: quizz.question.length,
  //         },
  //       },
  //       'Respuestas enviadas exitosamente',
  //     );
  //   } catch (error) {
  //     console.error('Error submitting quiz:', error); // Log error for debugging
  //     return errorResponse(
  //       'Error al enviar las respuestas del cuestionario',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       error.message,
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

}
