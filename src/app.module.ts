import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { ActivitiesModule } from './activities/activities.module';
import { CloudModule } from './cloud/cloud.module';
import { PostModule } from './post/post.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // Make sure config is globally available
    }),

    UsersModule,
    PrismaModule,
    CoursesModule,
    ActivitiesModule,
    CloudModule,
    PostModule,
    QuizzesModule,
    NotificationsModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/files', // This creates the public route
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from all origins
        },
      }
      
    }),
  ],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('Loaded SUPABASE_URL:', configService.get('SUPABASE_URL'));
    console.log('Loaded SUPABASE_KEY:', configService.get('SUPABASE_KEY'));
  }
}
