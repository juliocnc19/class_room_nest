import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostPrisma } from '@prisma/client';

export interface Post {
  createPost(post: CreatePostDto): Promise<PostPrisma>;
  findAllPosts(): Promise<PostPrisma[]>;
  findPostById(id: number): Promise<PostPrisma>;
  updatePost(post: UpdatePostDto): Promise<PostPrisma>;
  deletePost(id: number): Promise<PostPrisma>;
  findPostByCourse(course_id: number): Promise<PostPrisma[]>;
}
