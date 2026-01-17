import { IsEnum, IsArray, IsString, IsDateString } from "class-validator";
import { DocumentType } from "../entities/vehicle-integration-request.entity";

export class IdentityStepDto {
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @IsString()
    documentTypeNumber: string;
  
    @IsArray()
    @IsString({ each: true })
    identityFiles: string[];
  
    @IsDateString()
    identityFilesExpirationDate: string;
  }
  