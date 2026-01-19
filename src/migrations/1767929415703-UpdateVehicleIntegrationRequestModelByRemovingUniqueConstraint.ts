import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVehicleIntegrationRequestModelByRemovingUniqueConstraint1767929415703 implements MigrationInterface {
    name = 'UpdateVehicleIntegrationRequestModelByRemovingUniqueConstraint1767929415703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la contrainte UNIQUE de documentTypeNumber (créée dans la migration précédente)
        // Les contraintes UNIQUE pour registrationNumber et vin existent déjà, pas besoin de les recréer
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" DROP CONSTRAINT IF EXISTS "UQ_32416fa369fcaff49b760ff07db"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recréer la contrainte UNIQUE pour documentTypeNumber si on revert
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ADD CONSTRAINT "UQ_32416fa369fcaff49b760ff07db" UNIQUE ("documentTypeNumber")`);
    }

}
