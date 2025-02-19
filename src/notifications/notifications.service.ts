import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  NotificationDto,
  NotificationToAllUsersDto,
} from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';




@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {
    // Initialize Firebase Admin SDK
    if (admin.apps.length === 0) {
      const firebaseCredentials = {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
      };

      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(JSON.stringify(firebaseCredentials))),
      });
    }
  }

  async sendNotification(
    notificationDto: NotificationDto,
  ): Promise<NotificationResponseDto> {
    const { tokens, title, body, data } = notificationDto;

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message); // Corrected for your version
      console.log(`Notifications sent: ${response.successCount}`);
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  async sendNotificationToAllUsers(
    notificationDto: NotificationToAllUsersDto,
  ): Promise<NotificationResponseDto> {
    const { title, body, data } = notificationDto;

    // Fetch all users' Firebase tokens from the database
    const users = await this.prismaService.user.findMany({
      where: {
        firebaseToken: { not: null }, // Only users with tokens
      },
      select: {
        firebaseToken: true,
      },
    });

    const tokens = users
      .map((user) => user.firebaseToken)
      .filter((token) => token);

    if (!tokens.length) {
      throw new Error('No valid Firebase tokens found');
    }

    // Split tokens into batches of 500 (FCM limit for multicast messages)
    const batches = this.splitIntoBatches(tokens, 500);

    let successCount = 0;
    let failureCount = 0;
    const responses = [];

    for (const batch of batches) {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens: batch,
      };

      try {
        const response = await admin.messaging().sendEachForMulticast(message);
        successCount += response.successCount;
        failureCount += response.failureCount;

        responses.push(
          ...response.responses.map((res) => ({
            success: res.success,
            messageId: res.messageId,
            error: res.error ? { message: res.error.message } : undefined,
          })),
        );
      } catch (error) {
        console.error('Error sending batch:', error);
      }
    }

    return { successCount, failureCount, responses };
  }

  private splitIntoBatches(tokens: string[], batchSize: number): string[][] {
    const batches = [];
    for (let i = 0; i < tokens.length; i += batchSize) {
      batches.push(tokens.slice(i, i + batchSize));
    }
    return batches;
  }
}

