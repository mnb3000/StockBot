import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class UuidAbstract extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;
}
