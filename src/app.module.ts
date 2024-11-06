import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { ActivitiesModule } from './activities/activities.module';
import { CloudModule } from './cloud/cloud.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, PrismaModule, CoursesModule, ActivitiesModule, CloudModule, AdminModule],
  providers: [],
})
export class AppModule {}
