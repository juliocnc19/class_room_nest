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
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(`uploads/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { data, error: null };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error al subir archivo', 500);
    }
  }
}
