import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { errorResponse, successResponse } from 'src/utils/responseHttpUtils';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';


@Injectable()
export class CloudService {
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'class_room_documents';
  private readonly uploadFolder = 'uploads'; // Local folder for storing files


  constructor(
    private configService: ConfigService,
    private readonly prismaService: PrismaService,


  ) {
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
    console.log("🚀 File upload started...");
    console.log("Received file:", file ? file.originalname : "NO FILE RECEIVED");
    console.log("File size:", file?.size);
    console.log("Use Supabase:", useSupabase);

    try {
        const useSupabaseBool = useSupabase === 'true';

        if (!file) {
            console.error("❌ No file received!");
            return errorResponse('No file provided', HttpStatus.BAD_REQUEST);
        }

        if (useSupabaseBool) {
            console.log("🟢 Uploading to Supabase...");
            return await this.uploadToSupabase(file);
        } else {
            console.log("🟡 Uploading Locally...");
            return await this.uploadFileLocally(file);
        }
    } catch (error) {
        console.error("❌ Error in uploadFile:", error);
        return errorResponse('Error during file upload', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}

  /**
   * Upload file locally
   */private async uploadFileLocally(file: Express.Multer.File): Promise<any> {
    try {
      console.log("🟡 Saving file locally...");
      console.log("File Name:", file.originalname);
      console.log("File Size:", file.size);
      console.log("File Type:", file.mimetype);

      const uploadDir = join(__dirname, '..', '..', this.uploadFolder);
      if (!existsSync(uploadDir)) {
          console.log("📂 Creating upload directory:", uploadDir);
          mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = `${uploadDir}/${file.originalname}`;
      writeFileSync(filePath, file.buffer);
      console.log("✅ File saved locally:", filePath);

      return successResponse(
          { path: `/files/${file.originalname}`, fullPath: `http://localhost:3000/files/${file.originalname}` },
          'File uploaded locally',
      );
  } catch (error) {
      console.error("❌ Error in uploadFileLocally:", error);
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


  async generateExcel(model: string, res: Response) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(model.toUpperCase());

      // Validate if the model exists in Prisma
      if (!(model in this.prismaService)) {
        return errorResponse(`Modelo '${model}' no es válido`, HttpStatus.BAD_REQUEST);
      }

      // Fetch data dynamically
      const data = await this.prismaService[model].findMany();

      if (!data.length) {
        return errorResponse(`No se encontraron registros para '${model}'`, HttpStatus.NOT_FOUND);
      }

      // Extract headers dynamically
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Add data rows
      data.forEach(item => {
        worksheet.addRow(headers.map(header => item[header]));
      });

      // Save the file temporarily
      const filePath = `./temp/${model}-export.xlsx`;
      await workbook.xlsx.writeFile(filePath);

      // Stream the file to the client
      const fileStream = createReadStream(filePath);
      res.set('Content-Disposition', `attachment; filename=${model}-export.xlsx`);
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      return res.send(successResponse({}, `Archivo Excel generado para '${model}'`));
    } catch (error) {
      return errorResponse(`Error al generar Excel para '${model}'`, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
  }

  

