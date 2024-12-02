import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { ActivitiesModule } from './activities/activities.module';
import { CloudModule } from './cloud/cloud.module';
import { PostModule } from './post/post.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    CoursesModule,
    ActivitiesModule,
    CloudModule,
    PostModule,
    QuizzesModule,
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}
