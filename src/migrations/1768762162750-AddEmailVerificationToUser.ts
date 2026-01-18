import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationToUser1768762162750 implements MigrationInterface {
    name = 'AddEmailVerificationToUser1768762162750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
    }

}
