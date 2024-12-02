import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Number of notifications successfully sent',
    example: 50,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of notifications that failed to send',
    example: 2,
  })
  failureCount: number;

  @ApiProperty({
    description: 'Details of each notification sent',
    example: [
      { success: true, messageId: 'msg1' },
      { success: false, error: { message: 'Invalid token' } },
    ],
  })
  responses: Array<{
    success: boolean;
    messageId?: string;
    error?: {
      message: string;
    };
  }>;
}
