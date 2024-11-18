import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post as PostPrisma } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from './post.interface';

@Injectable()
export class PostService implements Post {
  constructor(private prismaService: PrismaService) {}

  async createPost(post: CreatePostDto): Promise<PostPrisma> {
    try {
      return await this.prismaService.post.create({ data: post });
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
