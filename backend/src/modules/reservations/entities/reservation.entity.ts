import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @ManyToOne(() => Property)
  property!: Property;

  @Column({ type: 'varchar' })
  guestName!: string;

  @Column({ type: 'varchar' })
  guestEmail!: string;

  @Column({ type: 'varchar' })
  guestPhone!: string;

  @Column({ type: 'date' })
  checkInDate!: Date;

  @Column({ type: 'date' })
  checkOutDate!: Date;

  @Column({ type: 'integer' })
  numberOfGuests!: number;

  @Column({ type: 'integer' })
  numberOfRooms!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'varchar' })
  currency: string = 'BRL';

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status!: string;

  @Column({ type: 'varchar', nullable: true })
  bookingSource: string; // 'booking', 'airbnb', 'direct', etc

  @Column({ type: 'varchar', nullable: true })
  externalBookingId!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
