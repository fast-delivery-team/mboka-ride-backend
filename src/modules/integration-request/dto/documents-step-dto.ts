import { IsDateString } from "class-validator";

export class DocumentsStepDto {
  
    @IsDateString()
    insuranceExpirationDate: string;

    @IsDateString()
    technicalInspectionExpirationDate: string;

  }
  