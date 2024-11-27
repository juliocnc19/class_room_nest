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
      const filePath = `uploads/${file.originalname}`;

      const { data: existingFile, error: checkError } =
        await this.supabase.storage
          .from(this.bucketName)
          .list('uploads', { search: file.originalname });

      if (checkError) {
        throw new HttpException(
          {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: checkError.message,
            data: {},
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (existingFile && existingFile.length > 0) {
        return {
          id: existingFile[0].id,
          path: `uploads/${existingFile[0].name}`,
          fullPath: `${this.bucketName}/${filePath}`,
        };
      }

      // Si no existe, subir el archivo
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
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

      return {
        id: data.id,
        path: data.path,
        fullPath: `${this.bucketName}/${data.path}`,
      };
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
