import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivitiesController } from './activities.controller';
import { CloudModule } from 'src/cloud/cloud.module';

@Module({
  imports: [PrismaModule, CloudModule],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
