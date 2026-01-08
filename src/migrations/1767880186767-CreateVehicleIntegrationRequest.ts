import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicleIntegrationRequest1767880186767 implements MigrationInterface {
    name = 'CreateVehicleIntegrationRequest1767880186767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."vehicle_integration_request_status_enum" AS ENUM('draft', 'pending', 'under_review', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_integration_request_documenttype_enum" AS ENUM('CNI', 'Passeport')`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_integration_request_vehicletype_enum" AS ENUM('Taxi', 'Bus')`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_integration_request_energy_enum" AS ENUM('Essence', 'Diesel', 'Hybride', 'Électrique')`);
        await queryRunner.query(`CREATE TABLE "vehicle_integration_request" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "status" "public"."vehicle_integration_request_status_enum" NOT NULL DEFAULT 'draft', "isFirstRequest" boolean NOT NULL DEFAULT false, "documentType" "public"."vehicle_integration_request_documenttype_enum" NOT NULL, "identityFiles" json NOT NULL, "identityFilesExpirationDate" date NOT NULL, "registrationNumber" character varying NOT NULL, "vin" character varying NOT NULL, "brand" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "vehicleType" "public"."vehicle_integration_request_vehicletype_enum", "seats" integer NOT NULL, "energy" "public"."vehicle_integration_request_energy_enum" NOT NULL, "color" character varying NOT NULL, "exclusiveDriving" boolean NOT NULL DEFAULT true, "registrationCardFiles" json NOT NULL, "insuranceFiles" json NOT NULL, "insuranceExpirationDate" date NOT NULL, "technicalInspectionFiles" json NOT NULL, "technicalInspectionExpirationDate" date NOT NULL, "photos" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_c17be8ec2c1bb2d760d2875ecd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ADD CONSTRAINT "FK_a493618f227d0d7eb2fd10a1b36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" DROP CONSTRAINT "FK_a493618f227d0d7eb2fd10a1b36"`);
        await queryRunner.query(`DROP TABLE "vehicle_integration_request"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_integration_request_energy_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_integration_request_vehicletype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_integration_request_documenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_integration_request_status_enum"`);
    }

}
