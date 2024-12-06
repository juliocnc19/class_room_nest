// chat.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, data: { userId: number, content: string, roomId: number, messageType: string }) {
    const { userId, content, roomId, messageType } = data;
    const message = await this.chatService.sendMessage(userId, roomId, content, messageType);
    this.server.to(roomId.toString()).emit('message', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: number) {
    client.join(roomId.toString());
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('createPrivateChat')
  async handleCreatePrivateChat(client: Socket, data: { userId: number, otherUserId: number }) {
    const { userId, otherUserId } = data;
    const chatRoom = await this.chatService.getOrCreatePrivateRoom(userId, otherUserId);
    client.join(chatRoom.data.id.toString());
    this.server.to(chatRoom.data.id.toString()).emit('chatRoomCreated', chatRoom);
  }

  @SubscribeMessage('createGroupChat')
  async handleCreateGroupChat(client: Socket, data: { userId: number, userIds: number[], roomName: string }) {
    const { userId, userIds, roomName } = data;
    const chatRoom = await this.chatService.createGroupRoom(userId, userIds, roomName);
    client.join(chatRoom.data.id.toString());
    this.server.to(chatRoom.data.id.toString()).emit('chatRoomCreated', chatRoom);
  }
}



