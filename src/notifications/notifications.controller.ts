import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto, NotificationToAllUsersDto } from './dto/create-notification.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationResponseDto } from './dto/notification-response.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send push notifications to multiple devices' })
  @ApiResponse({ status: 201, description: 'Notifications sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendNotification(@Body() notificationDto: NotificationDto) {
    try {
      const result = await this.notificationsService.sendNotification(notificationDto);
      return {
        message: 'Notifications sent successfully',
        result,
      };
    } catch (error) {
      return {
        message: 'Failed to send notifications',
        error: error.message,
      };
    }
  }


  @Post('send-to-all')
  @ApiOperation({ summary: 'Send a notification to all users' })
  @ApiResponse({ status: 200, description: 'Notifications sent successfully', type: NotificationResponseDto })
  async sendNotificationToAllUsers(
    @Body() notificationDto: NotificationToAllUsersDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.sendNotificationToAllUsers(notificationDto);
  }
}
