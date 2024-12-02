import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, NotificationsService],
})
export class PostModule {}
