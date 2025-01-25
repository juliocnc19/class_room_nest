import { ApiResponse } from 'src/utils/responseHttpUtils';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostPrisma } from '@prisma/client';

export interface Post {
  createPost(post: CreatePostDto): Promise<ApiResponse<PostPrisma>>;
  findAllPosts(): Promise<ApiResponse<PostPrisma[]>>;
  findPostById(id: number): Promise<ApiResponse<PostPrisma>>;
  updatePost(post: UpdatePostDto): Promise<ApiResponse<PostPrisma>>;
  deletePost(id: number): Promise<ApiResponse<PostPrisma>>;
  findPostByCourse(course_id: number): Promise<ApiResponse<PostPrisma[]>>;
}
