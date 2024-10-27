import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [UsersModule, PrismaModule, CoursesModule],
  providers: [],
})
export class AppModule {}
