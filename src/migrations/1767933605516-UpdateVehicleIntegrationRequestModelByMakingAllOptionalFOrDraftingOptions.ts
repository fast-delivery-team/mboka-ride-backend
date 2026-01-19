import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVehicleIntegrationRequestModelByMakingAllOptionalFOrDraftingOptions1767933605516 implements MigrationInterface {
    name = 'UpdateVehicleIntegrationRequestModelByMakingAllOptionalFOrDraftingOptions1767933605516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // documentTypeNumber existe déjà et est nullable depuis les migrations précédentes, pas besoin de la recréer
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "isFirstRequest" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "documentType" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "identityFiles" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "identityFilesExpirationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "registrationNumber" DROP NOT NULL`);
        // Les contraintes UNIQUE pour registrationNumber et vin existent déjà depuis la migration 1767928807925
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "model" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "year" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "seats" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "energy" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "color" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "exclusiveDriving" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "registrationCardFiles" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "insuranceFiles" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "insuranceExpirationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "technicalInspectionFiles" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "technicalInspectionExpirationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "photos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "updatedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "photos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "technicalInspectionExpirationDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "technicalInspectionFiles" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "insuranceExpirationDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "insuranceFiles" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "registrationCardFiles" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "exclusiveDriving" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "color" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "energy" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "seats" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "year" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "model" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "brand" SET NOT NULL`);
        // Ne pas supprimer les contraintes UNIQUE car elles sont nécessaires pour d'autres migrations
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "registrationNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "identityFilesExpirationDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "identityFiles" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "documentType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "isFirstRequest" SET NOT NULL`);
        // documentTypeNumber existe déjà, pas besoin de la supprimer dans le down
    }

}
