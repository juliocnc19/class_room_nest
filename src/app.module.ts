import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { ActivitiesModule } from './activities/activities.module';
import { CloudModule } from './cloud/cloud.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    CoursesModule,
    ActivitiesModule,
    CloudModule,
    PostModule,
  ],
  providers: [],
})
export class AppModule {}
