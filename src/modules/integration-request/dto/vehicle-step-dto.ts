import { IsBoolean, IsEnum, IsString, Matches } from "class-validator";

import { IsInt } from "class-validator";
import { EnergyType, VehicleType } from "../entities/vehicle-integration-request.entity";

    export class VehicleStepDto {
    @IsString()
    @Matches(/^\d{3}-[A-Z]{2}-\d$/)
    registrationNumber: string;
  
    @IsString()
    vin: string;
  
    @IsString()
    brand: string;
  
    @IsString()
    model: string;
  
    @IsInt()
    year: number;
  
    @IsEnum(VehicleType)
    vehicleType: VehicleType;
  
    @IsInt()
    seats: number;
  
    @IsEnum(EnergyType)
    energy: EnergyType;

    @IsString()
    color: string;

    @IsBoolean()
    exclusiveDriving: boolean;
  }
  