import { Injectable } from '@nestjs/common';
import { Post as PostPrisma } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from './post.interface';

@Injectable()
export class PostService implements Post {
  constructor(private prismaService: PrismaService) {}

  async createPost(post: CreatePostDto): Promise<PostPrisma> {
    return await this.prismaService.post.create({ data: post });
  }

  async findAllPosts(): Promise<PostPrisma[]> {
    return await this.prismaService.post.findMany();
  }

  async findPostById(id: number): Promise<PostPrisma> {
    return await this.prismaService.post.findUnique({ where: { id } });
  }

  async updatePost(post: UpdatePostDto): Promise<PostPrisma> {
    return await this.prismaService.post.update({
      where: { id: post.id },
      data: post,
    });
  }

  async deletePost(id: number): Promise<PostPrisma> {
    return await this.prismaService.post.delete({ where: { id } });
  }
}
