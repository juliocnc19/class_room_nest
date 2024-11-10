import {
  Body,
  Controller,
  Delete,
  Get,
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
    return await this.postService.createPost(post);
  }

  @Get('all')
  async findAllPosts() {
    return await this.postService.findAllPosts();
  }

  @Get(':id')
  async findPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findPostById(id);
  }

  @Put()
  async updatePost(@Body() post: UpdatePostDto) {
    return await this.postService.updatePost(post);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.deletePost(id);
  }
}
