import { Column, Entity } from 'typeorm';
import { UuidAbstract } from './types/uuid.abstract';

@Entity()
export class User extends UuidAbstract {
  @Column('int', { unique: true })
  tgId!: number;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ default: false })
  isAuthorized!: boolean;
}
