import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { ActivitiesModule } from './activities/activities.module';
import { CloudModule } from './cloud/cloud.module';

@Module({
  imports: [UsersModule, PrismaModule, CoursesModule, ActivitiesModule, CloudModule],
  providers: [],
})
export class AppModule {}
