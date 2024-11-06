import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CloudService {
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'class_room';
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadFile(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error al subir archivo:', error);
      return { data: null, error };
    }
  }
}
