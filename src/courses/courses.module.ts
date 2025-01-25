import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesController } from './courses.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [PrismaModule],
  providers: [CoursesService, NotificationsService],
  controllers: [CoursesController],
})
export class CoursesModule {}
