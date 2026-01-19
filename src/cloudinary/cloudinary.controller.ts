import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

    @Post('files')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
      const urls = await this.cloudinaryService.uploadMultipleFiles(files);
      return { urls };
    }
}
