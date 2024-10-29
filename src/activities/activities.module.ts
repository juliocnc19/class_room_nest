import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivitiesController } from './activities.controller';

@Module({
  imports: [PrismaModule],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
