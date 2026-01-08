import { User } from "src/modules/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum DocumentType {
    CNI = 'CNI',
    PASSEPORT = 'Passeport',
}

export enum VehicleType {
    TAXI = 'Taxi',
    BUS = 'Bus',
}
  
export enum EnergyType {
    ESSENCE = 'Essence',
    DIESEL = 'Diesel',
    HYBRIDE = 'Hybride',
    ELECTRIQUE = 'Électrique',
  }
  
  export enum RequestStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity()
export class VehicleIntegrationRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.DRAFT,
    })
    status: RequestStatus;

    @Column({ default: false })
    isFirstRequest: boolean;

    @Column({
        type: 'enum',
        enum: DocumentType,
    })
    documentType: DocumentType;

    @Column({ type: 'json' })
    identityFiles: string[];

    @Column({ type: 'date' })
    identityFilesExpirationDate: Date;

    @Column()
    registrationNumber: string;

    @Column()
    vin: string;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column({ type: 'integer' })
    year: number;

    @Column({ type: 'enum', enum: VehicleType, nullable: true })
    vehicleType: VehicleType;

    @Column({ type: 'integer' })
    seats: number;

    @Column({ type: 'enum', enum: EnergyType })
    energy: EnergyType;

    @Column()
    color: string;

    @Column({ type: 'boolean', default: true })
    exclusiveDriving: boolean;

    @Column({ type: 'json' })
    registrationCardFiles: string[];

    @Column({ type: 'json' })
    insuranceFiles: string[];

    @Column({ type: 'date' })
    insuranceExpirationDate: Date;

    @Column({ type: 'json' })
    technicalInspectionFiles: string[];

    @Column({ type: 'date' })
    technicalInspectionExpirationDate: Date;

    @Column({ type: 'json' })
    photos: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
