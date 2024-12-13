import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatService, ChatGateway, PrismaService],
  controllers: [ChatController]
})
export class ChatModule {}
