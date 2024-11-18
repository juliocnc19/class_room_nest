import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CloudService {
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'class_room_documents';
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ id: string; path: string; fullPath: string }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(`uploads/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });
      if (error) {
        throw new HttpException(
          {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: {},
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return data;
    } catch (e) {
      const error = e as Error;
      console.log(error);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
