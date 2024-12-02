import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post as PostPrisma } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from './post.interface';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PostService implements Post {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService) {}

    async createPost(post: CreatePostDto): Promise<PostPrisma> {
      try {
        // Create the post in the database
        const newPost = await this.prismaService.post.create({ data: post });
    
        // Fetch course details to include the course title in the notification
        const course = await this.prismaService.course.findUnique({
          where: { id: post.courseId },
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
    
        // Fetch all users related to the course, excluding the author
        const users = await this.prismaService.courseEnrollment.findMany({
          where: {
            courseId: post.courseId,
            userId: { not: post.authorId },
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
          const notificationTitle = `New post en curso: ${course.title}`;
          const notificationBody = `${post.title}: ${post.content}`;
          await this.notificationsService.sendNotification({
            tokens,
            title: notificationTitle,
            body: notificationBody,
            data: {
              courseId: post.courseId.toString(),
              postId: newPost.id.toString(),
            },
          });
        }
    
        return newPost;
      } catch (e) {
        const error = e as Error;
        throw new HttpException(
          {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: {},
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    
  async findAllPosts(): Promise<PostPrisma[]> {
    try {
      return await this.prismaService.post.findMany();
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPostById(id: number): Promise<PostPrisma> {
    try {
      const post = await this.prismaService.post.findUnique({ where: { id } });
      if (!post)
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            message: 'Post not found',
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      return post;
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(post: UpdatePostDto): Promise<PostPrisma> {
    try {
      return await this.prismaService.post.update({
        where: { id: post.id },
        data: post,
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(id: number): Promise<PostPrisma> {
    try {
      return await this.prismaService.post.delete({ where: { id } });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPostByCourse(course_id: number): Promise<PostPrisma[]> {
    try {
      return await this.prismaService.post.findMany({
        where: { courseId: course_id },
      });
    } catch (e) {
      const error = e as Error;
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
