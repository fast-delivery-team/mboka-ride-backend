import { IsArray, IsDateString } from "class-validator";

export class DocumentsStepDto {
  
    @IsArray()
    registrationCardFiles: string[];
  
    @IsArray()
    insuranceFiles: string[];
  
    @IsDateString()
    insuranceExpirationDate: string;

    @IsArray()
    technicalInspectionFiles: string[];

    @IsDateString()
    technicalInspectionExpirationDate: string;

    @IsArray()
    photos: string[];
  }
  