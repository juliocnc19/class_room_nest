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
    return this.postService.createPost(post);
  
  }

  @Get('all')
  async findAllPosts() {
    return this.postService.findAllPosts();
 
  }

  @Get(':id')
  async findPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findPostById(id);
    
  }

  @Put()
  async updatePost(@Body() post: UpdatePostDto) {
    return this.postService.updatePost(post);

  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);

  }

  @Get('/course/:course_id')
  async fidndPostByCourse(@Param('course_id', ParseIntPipe) course_id: number) {
    return this.postService.findPostByCourse(course_id);
  
  }
}
