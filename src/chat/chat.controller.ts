import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateGroupChatDto, CreatePrivateChatDto, SendMessageDto, UpdateTypingStatusDto, UpdateUserStatusDto } from './dto/chat-dtos.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('private')
  createPrivateChat(@Body() createPrivateChatDto: CreatePrivateChatDto) {
    return this.chatService.getOrCreatePrivateRoom(createPrivateChatDto.userId, createPrivateChatDto.otherUserId);
  }

  @Post('group')
  createGroupChat(@Body() createGroupChatDto: CreateGroupChatDto) {
    return this.chatService.createGroupRoom(createGroupChatDto.userId, createGroupChatDto.userIds, createGroupChatDto.roomName);
  }

  @Post('send-message')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(sendMessageDto.userId, sendMessageDto.roomId, sendMessageDto.content, sendMessageDto.messageType);
  }

  @Post('typing')
  updateTypingStatus(@Body() updateTypingStatusDto: UpdateTypingStatusDto) {
    return this.chatService.updateTypingStatus(updateTypingStatusDto);
  }

  @Post('user-status')
  updateUserStatus(@Body() updateUserStatusDto: UpdateUserStatusDto) {
    return this.chatService.updateUserStatus(updateUserStatusDto);
  }
}