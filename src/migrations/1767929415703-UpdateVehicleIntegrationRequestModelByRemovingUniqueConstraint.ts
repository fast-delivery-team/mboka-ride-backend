import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVehicleIntegrationRequestModelByRemovingUniqueConstraint1767929415703 implements MigrationInterface {
    name = 'UpdateVehicleIntegrationRequestModelByRemovingUniqueConstraint1767929415703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ADD "documentTypeNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ADD CONSTRAINT "UQ_d01bd43a6f321f1ad3a4814c407" UNIQUE ("registrationNumber")`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ADD CONSTRAINT "UQ_a54a691ff7b232ed57f780d8932" UNIQUE ("vin")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" DROP CONSTRAINT "UQ_a54a691ff7b232ed57f780d8932"`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" DROP CONSTRAINT "UQ_d01bd43a6f321f1ad3a4814c407"`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" DROP COLUMN "documentTypeNumber"`);
    }

}
