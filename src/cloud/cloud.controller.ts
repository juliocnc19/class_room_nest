import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudService } from './cloud.service';
import * as multer from 'multer';
import { ApiTags } from '@nestjs/swagger';

@Controller('cloud')
@ApiTags('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('send/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async sendActivityFile(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudService.uploadFile(file);
  }
}
