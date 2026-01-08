import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, Min, ValidateIf } from "class-validator";
import { EnergyType, VehicleType } from "../entities/vehicle-integration-request.entity";

export class AddVehicleDto {
    @IsEnum(DocumentType, { message: 'Type de pièce doit être CNI ou Passeport' })
    @IsNotEmpty({ message: 'Type de pièce est requis' })
    documentType: DocumentType;
  
    @IsArray({ message: 'Fichier pièce doit être une liste de fichiers' })
    @IsNotEmpty({ message: 'Fichier pièce est requis' })
    @IsString({ each: true, message: 'Chaque fichier doit être une chaîne' })
    identityFiles: string[];
  
    @IsDateString({}, { message: 'Date d\'expiration doit être une date valide' })
    @IsNotEmpty({ message: 'Date d\'expiration est requise' })
    identityExpirationDate: string;
  
    @IsString({ message: 'Immatriculation doit être une chaîne' })
    @IsNotEmpty({ message: 'Immatriculation est requise' })
    @Matches(/^\d{3}-[A-Z]{2}-\d{1}$/, {
      message: 'Immatriculation doit être au format NNN-LL-N (ex: 123-AB-4)',
    })
    registrationNumber: string;
  
    @IsString({ message: 'VIN doit être une chaîne' })
    @IsNotEmpty({ message: 'VIN est requis' })
    @Matches(/^[A-Z0-9]+$/, {
      message: 'VIN doit être alphanumérique',
    })
    vin: string;

    @IsString({ message: 'Marque doit être une chaîne' })
    @IsNotEmpty({ message: 'Marque est requise' })
    brand: string;

    @IsString({ message: 'Modèle doit être une chaîne' })
    @IsNotEmpty({ message: 'Modèle est requis' })
    model: string;

    @IsInt({ message: 'Année doit être un nombre entier' })
    @Min(1990, { message: 'Année doit être supérieure ou égale à 1990' })
    @Max(new Date().getFullYear(), {
        message: `Année doit être inférieure ou égale à ${new Date().getFullYear()}`,
    })
    @IsNotEmpty({ message: 'Année est requise' })
    year: number;

    @IsEnum(VehicleType, { message: 'Type doit être Taxi ou Bus' })
    @IsNotEmpty({ message: 'Type est requis' })
    vehicleType: VehicleType;

    @IsInt({ message: 'Places doit être un nombre entier' })
    @Min(1, { message: 'Places doit être au moins 1' })
    @IsNotEmpty({ message: 'Places est requis' })
    seats: number;

    @IsEnum(EnergyType, {
        message: 'Énergie doit être Essence, Diesel, Hybride ou Électrique',
    })
    @IsNotEmpty({ message: 'Énergie est requise' })
    energy: EnergyType;

    @IsString({ message: 'Couleur doit être une chaîne' })
    @IsNotEmpty({ message: 'Couleur est requise' })
    color: string;

    @IsBoolean({ message: 'Exclusivité conduite doit être un boolean' })
    @IsNotEmpty({ message: 'Exclusivité conduite est requise' })
    exclusiveDriving: boolean;

    @IsArray({ message: "La carte grise doit être une liste de fichiers" })
    @IsNotEmpty({ message: 'La carte grise est requise' })
    @IsString({ each: true, message: 'Chaque fichier doit être une chaîne' })
    registrationCardFiles: string[];

    @IsArray({ message: "L'assurance doit être une liste de fichiers" })
    @IsNotEmpty({ message: 'L\'assurance est requise' })
    @IsString({ each: true, message: 'Chaque fichier doit être une chaîne' })
    insuranceFiles: string[];

    @IsDateString({}, { message: 'Date d\'expiration assurance doit être une date valide' })
    @IsNotEmpty({ message: 'Date d\'expiration assurance est requise' })
    insuranceExpirationDate: string;

    @IsArray({ message: "La visite technique doit être une liste de fichiers" })
    @IsNotEmpty({ message: 'La visite technique est requise' })
    @IsString({ each: true, message: 'Chaque fichier doit être une chaîne' })
    technicalInspectionFiles: string[];

    @ValidateIf(
        (o) => o.technicalInspectionFiles && o.technicalInspectionFiles.length > 0,
    )
    @IsDateString({}, {
        message: 'Date d\'expiration visite technique doit être une date valide',
    })
    @IsOptional()
    technicalInspectionExpirationDate?: string;

    @IsArray({ message: 'Photos doit être une liste de fichiers' })
    @IsOptional()
    @IsString({ each: true })
    photos?: string[];
}