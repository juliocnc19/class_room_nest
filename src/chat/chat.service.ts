import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoom, Message, MessageType, UserStatus } from '@prisma/client';
import { SendMessageDto, UpdateTypingStatusDto, UpdateUserStatusDto } from './dto/chat-dtos.dto';
import { errorResponse, successResponse } from 'src/utils/responseHttpUtils';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) {}

     // Create or fetch a private chat room for two users
     async getOrCreatePrivateRoom(userId1: number, userId2: number) {
      try {
        let chatRoom = await this.prismaService.chatRoom.findFirst({
          where: {
            AND: [
              { users: { some: { userId: userId1 } } },
              { users: { some: { userId: userId2 } } }
            ]
          },
        });
    
        if (!chatRoom) {
          chatRoom = await this.prismaService.chatRoom.create({
            data: {
              isGroup: false,
              users: {
                create: [
                  { userId: userId1, roleId: 1 },
                  { userId: userId2, roleId: 1 }
                ]
              }
            },
          });
        }
    
        return successResponse(chatRoom);
      } catch (error) {
        errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    

  // Create or fetch a group chat room
  async createGroupRoom(userId: number, userIds: number[], roomName: string) {
    try {
      const chatRoom = await this.prismaService.chatRoom.create({
        data: {
          isGroup: true,
          name: roomName,
          users: {
            create: [
              { userId, roleId: 1 },
              ...userIds.map(user => ({ userId: user, roleId: 1 }))
            ]
          },
        },
      });
  
      return successResponse(chatRoom);
    } catch (error) {
      errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  


  // Add users to an existing group chat room
  async addUsersToGroup(roomId: number, userIds: number[]) {
    try {
      const chatRoom = await this.prismaService.chatRoom.update({
        where: { id: roomId },
        data: {
          users: {
            create: userIds.map(userId => ({ userId, roleId: 1 }))
          },
        },
      });
  
      return successResponse(chatRoom);
    } catch (error) {
      errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  // Remove users from a group chat room
  async removeUsersFromGroup(roomId: number, userIds: number[]): Promise<ChatRoom> {
    const chatRoom = await this.prismaService.chatRoom.update({
      where: { id: roomId },
      data: {
        users: {
          deleteMany: { userId: { in: userIds } },
        },
      },
    });

    return chatRoom;
  }

  // Set typing status for a user
  async updateTypingStatus({ userId, roomId, isTyping }: UpdateTypingStatusDto) {
    try {
      const chatRoom = await this.prismaService.chatRoom.findUnique({ where: { id: roomId } });
      if (!chatRoom) {
        errorResponse('Chat room does not exist', HttpStatus.BAD_REQUEST);
      }
  
      const userStatus = await this.prismaService.chatRoomUser.updateMany({
        where: { userId, chatRoomId: roomId },
        data: { isTyping },
      });
  
      return successResponse(userStatus);
    } catch (error) {
      errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  // Set or update the user's online status
  async updateUserStatus({ userId, isOnline }: UpdateUserStatusDto): Promise<UserStatus> {
    const userStatus = await this.prismaService.userStatus.upsert({
      where: { id: userId },
      update: { isOnline, lastActive: new Date() },
      create: { userId, isOnline, lastActive: new Date() },
    });

    return userStatus;
  }

    // Send a message to a chat room

  async sendMessage(userId: number, roomId: number, content: string, messageType: string) {
    try {
      const chatRoom = await this.prismaService.chatRoom.findUnique({ where: { id: roomId } });
      if (!chatRoom) {
        errorResponse('Chat room does not exist', HttpStatus.BAD_REQUEST);
      }
  
      const newMessage = await this.prismaService.message.create({
        data: {
          content,
          senderId: userId,
          chatRoomId: roomId,
          messageType: messageType as MessageType,
        },
      });
  
      return successResponse(newMessage);
    } catch (error) {
      errorResponse(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  // Set last seen status (optional enhancement)
  async updateLastSeen(userId: number): Promise<UserStatus> {
    const userStatus = await this.prismaService.userStatus.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });
  
    return userStatus;
  }
      
}
