import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';
import { IsInt, IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePrivateChatDto {
  @ApiProperty({ description: 'ID of the first user', example: 1 })
  userId: number;

  @ApiProperty({ description: 'ID of the second user', example: 2 })
  otherUserId: number;
}



export class CreateGroupChatDto {
  @ApiProperty({ description: 'ID of the user who is creating the group', example: 1 })
  userId: number;

  @ApiProperty({ description: 'IDs of the users to be added to the group', example: [2, 3, 4] })
  userIds: number[];

  @ApiProperty({ description: 'Name of the group chat', example: 'Study Group' })
  roomName: string;
}



export class SendMessageDto {
  @ApiProperty({ description: 'ID of the sender', example: 1 })
  userId: number;

  @ApiProperty({ description: 'ID of the chat room', example: 1 })
  roomId: number;

  @ApiProperty({ description: 'Message content', example: 'Hello!' })
  content: string;

  @ApiProperty({ enum: MessageType, description: 'Type of the message', example: 'TEXT' })
  messageType: MessageType;
}



export class UpdateTypingStatusDto {
  @ApiProperty({ description: 'ID of the user who is typing', example: 1 })
  userId: number;

  @ApiProperty({ description: 'ID of the chat room', example: 1 })
  roomId: number;

  @ApiProperty({ description: 'Typing status of the user', example: true })
  isTyping: boolean;
}


export class UpdateUserStatusDto {
  @ApiProperty({ description: 'ID of the user whose status is being updated', example: 1 })
  userId: number;

  @ApiProperty({ description: 'User online status', example: true })
  isOnline: boolean;
}