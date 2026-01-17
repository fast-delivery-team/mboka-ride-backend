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

export enum IntegrationStep {
    IDENTITY = 'identity',
    VEHICLE = 'vehicle',
    DOCUMENTS = 'documents',
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

    @Column({ default: false, nullable: true })
    isFirstRequest: boolean;

    @Column({
        type: 'enum',
        enum: DocumentType,
        nullable: true,
    })
    documentType: DocumentType;

    @Column({ nullable: true })
    documentTypeNumber: string;

    @Column({ type: 'json', nullable: true })
    identityFiles: string[];

    @Column({ type: 'date', nullable: true })
    identityFilesExpirationDate: Date;

    @Column({ unique: true, nullable: true })
    registrationNumber: string;

    @Column({ unique: true })
    vin: string;

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    model: string;

    @Column({ type: 'integer', nullable: true })
    year: number;

    @Column({ type: 'enum', enum: VehicleType, nullable: true })
    vehicleType: VehicleType;

    @Column({ type: 'integer', nullable: true })
    seats: number;

    @Column({ type: 'enum', enum: EnergyType, nullable: true })
    energy: EnergyType;

    @Column({ nullable: true })
    color: string;

    @Column({ type: 'boolean', default: true, nullable: true })
    exclusiveDriving: boolean;

    @Column({ type: 'json', nullable: true })
    registrationCardFiles: string[];

    @Column({ type: 'json', nullable: true })
    insuranceFiles: string[];

    @Column({ type: 'date', nullable: true })
    insuranceExpirationDate: Date;

    @Column({ type: 'json', nullable: true })
    technicalInspectionFiles: string[];

    @Column({ type: 'date', nullable: true })
    technicalInspectionExpirationDate: Date;

    @Column({ type: 'json', nullable: true })
    photos: string[];

    @Column({ type: 'enum', enum: IntegrationStep, default: IntegrationStep.IDENTITY })
    currentStep: IntegrationStep;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
