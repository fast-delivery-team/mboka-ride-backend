import { Injectable, OnModuleInit } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { env } from 'src/config/env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService implements OnModuleInit {

    constructor(private readonly configService: ConfigService) {
        const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

        if (!cloudName || !apiKey || !apiSecret) {
          throw new Error('Cloudinary configuration is missing. Check your .env.dev file');
        }
    
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
      }

    onModuleInit() {
        cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'mboka-ride',
            },
            (error, result: UploadApiResponse) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      }
    
      async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(files.map(file => this.uploadFile(file)));
      }
    
      async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
      }
}
