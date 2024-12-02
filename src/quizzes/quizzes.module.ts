import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [QuizzesController],
  providers: [
    QuizzesService,
    NotificationsService
  ],
})
export class QuizzesModule {}
