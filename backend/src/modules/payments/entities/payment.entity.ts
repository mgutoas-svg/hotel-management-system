import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reservationId: string;

  @ManyToOne(() => Reservation)
  reservation: Reservation;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  currency: string; // 'USD', 'BRL', 'EUR', etc

  @Column({ type: 'varchar' })
  paymentMethod: string; // 'stripe', 'paypal', 'credit_card'

  @Column({ type: 'varchar' })
  status: string; // 'pending', 'completed', 'failed', 'refunded'

  @Column({ type: 'varchar', nullable: true })
  transactionId: string; // Stripe or PayPal ID

  @Column({ type: 'varchar', nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'varchar', nullable: true })
  paypalOrderId: string;

  @Column({ type: 'varchar', nullable: true })
  invoiceNumber: string;

  @Column({ type: 'text', nullable: true })
  metadata: string; // JSON string

  @Column({ type: 'boolean', default: false })
  isRefunded: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
