import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  event!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Column({ type: 'integer', default: 0 })
  deliveredCount: number = 0;

  @Column({ type: 'integer', default: 0 })
  failedCount: number = 0;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
