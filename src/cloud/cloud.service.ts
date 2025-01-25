import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { errorResponse, successResponse } from 'src/utils/responseHttpUtils';

@Injectable()
export class CloudService {
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'class_room_documents';
  private readonly uploadFolder = 'uploads'; // Local folder for storing files


  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('SUPABASE_KEY:', supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_KEY is missing in the environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // constructor() {
  //   this.supabase = createClient(
  //     process.env.SUPABASE_URL,
  //     process.env.SUPABASE_KEY,
  //   );
  // }


  /**
   * Upload file (decides between local or Supabase based on useSupabase flag)
   */
  async uploadFile(
    file: Express.Multer.File,
    useSupabase: string = 'false',
  ): Promise<any> {
    console.log("entro");
    
    try {
      const useSupabaseBool = useSupabase === 'true';

      if (!file) {
        return errorResponse('No file provided', HttpStatus.BAD_REQUEST);
      }

      if (useSupabaseBool) {
        return await this.uploadToSupabase(file);
      } else {
        return await this.uploadFileLocally(file);
      }
    } catch (error) {
      return errorResponse('Error during file upload', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  /**
   * Upload file locally
   */
  private async uploadFileLocally(file: Express.Multer.File): Promise<any> {
    try {
      const uploadDir = join(__dirname, '..', '..', this.uploadFolder);
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = `${uploadDir}/${file.originalname}`;
      writeFileSync(filePath, file.buffer);

      return successResponse(
        { path: `/files/${file.originalname}`, fullPath: `http://localhost:3000/files/${file.originalname}` },
        'File uploaded locally',
      );
    } catch (error) {
      return errorResponse('Failed to upload file locally', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  /**
   * Upload file to Supabase
   */
  private async uploadToSupabase(
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const filePath = `uploads/${file.originalname}`;

      const { data: existingFile, error: checkError } =
        await this.supabase.storage
          .from(this.bucketName)
          .list('uploads', { search: file.originalname });

      if (checkError) {
        return errorResponse('Error checking existing file in Supabase', HttpStatus.INTERNAL_SERVER_ERROR, checkError);
      }

      if (existingFile && existingFile.length > 0) {
        return successResponse(
          {
            path: `uploads/${existingFile[0].name}`,
            fullPath: `${process.env.SUPABASE_STORAGE_URL}/${this.bucketName}/${filePath}`,
          },
          'File already exists in Supabase',
        );
      }

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        return errorResponse('Error uploading file to Supabase', HttpStatus.INTERNAL_SERVER_ERROR, error);
      }

      return successResponse(
        { path: data.path, fullPath: `${process.env.SUPABASE_STORAGE_URL}/${this.bucketName}/${data.path}` },
        'File uploaded to Supabase',
      );
    } catch (error) {
      return errorResponse('Failed to upload file to Supabase', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
  }

  // async uploadFile(
  //   file: Express.Multer.File,
  // ): Promise<{ id: string; path: string; fullPath: string }> {
  //   try {
  //     const filePath = `uploads/${file.originalname}`;

  //     const { data: existingFile, error: checkError } =
  //       await this.supabase.storage
  //         .from(this.bucketName)
  //         .list('uploads', { search: file.originalname });

  //     if (checkError) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.INTERNAL_SERVER_ERROR,
  //           message: checkError.message,
  //           data: {},
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     if (existingFile && existingFile.length > 0) {
  //       return {
  //         id: existingFile[0].id,
  //         path: `uploads/${existingFile[0].name}`,
  //         fullPath: `${this.bucketName}/${filePath}`,
  //       };
  //     }

  //     // Si no existe, subir el archivo
  //     const { data, error } = await this.supabase.storage
  //       .from(this.bucketName)
  //       .upload(filePath, file.buffer, {
  //         contentType: file.mimetype,
  //       });

  //     if (error) {
  //       throw new HttpException(
  //         {
  //           code: HttpStatus.INTERNAL_SERVER_ERROR,
  //           message: error.message,
  //           data: {},
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     return {
  //       id: data.id,
  //       path: data.path,
  //       fullPath: `${this.bucketName}/${data.path}`,
  //     };
  //   } catch (e) {
  //     const error = e as Error;
  //     console.log(error);
  //     throw new HttpException(
  //       {
  //         code: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //         data: {},
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

