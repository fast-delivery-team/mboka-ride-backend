import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeVinNullable1768643761371 implements MigrationInterface {
    name = 'MakeVinNullable1768643761371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "vin" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_integration_request" ALTER COLUMN "vin" SET NOT NULL`);
    }

}
