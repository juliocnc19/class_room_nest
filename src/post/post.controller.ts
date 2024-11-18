import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    const postCreated = await this.postService.createPost(post);
    return {
      code: HttpStatus.CREATED,
      message: 'Post created',
      data: postCreated,
    };
  }

  @Get('all')
  async findAllPosts() {
    const posts = await this.postService.findAllPosts();
    return {
      code: HttpStatus.OK,
      message: 'All posts',
      data: posts,
    };
  }

  @Get(':id')
  async findPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.findPostById(id);
    return {
      code: HttpStatus.OK,
      message: 'Post found',
      data: post,
    };
  }

  @Put()
  async updatePost(@Body() post: UpdatePostDto) {
    const postUpdate = await this.postService.updatePost(post);
    return {
      code: HttpStatus.OK,
      message: 'Post updated',
      data: postUpdate,
    };
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.deletePost(id);
    return {
      code: HttpStatus.OK,
      message: 'Post deleted',
      data: post,
    };
  }

  @Get('/course/:course_id')
  async fidndPostByCourse(@Param('course_id', ParseIntPipe) course_id: number) {
    const post = await this.postService.findPostByCourse(course_id);
    return {
      code: HttpStatus.OK,
      message: 'Posts found',
      data: post,
    };
  }
}
