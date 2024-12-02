import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivitiesController } from './activities.controller';
import { CloudModule } from 'src/cloud/cloud.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [PrismaModule, CloudModule],
  providers: [ActivitiesService, NotificationsService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
