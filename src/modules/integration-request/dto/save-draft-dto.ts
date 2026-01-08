import { IsOptional, IsEnum, IsString, IsDateString, IsBoolean, IsInt, IsArray } from 'class-validator';
import {
  DocumentType,
  VehicleType,
  EnergyType,
} from '../entities/vehicle-integration-request.entity';

export class SaveDraftDto {
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  identityFiles?: string[];

  @IsOptional()
  @IsDateString()
  identityExpirationDate?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsInt()
  seats?: number;

  @IsOptional()
  @IsEnum(EnergyType)
  energy?: EnergyType;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  exclusiveDriving?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrationCardFiles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  insuranceFiles?: string[];

  @IsOptional()
  @IsDateString()
  insuranceExpirationDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technicalInspectionFiles?: string[];

  @IsOptional()
  @IsDateString()
  technicalInspectionExpirationDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}