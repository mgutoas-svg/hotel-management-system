import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitude: number;

  @Column({ type: 'integer' })
  totalRooms: number;

  @Column({ type: 'varchar' })
  propertyType: string; // hotel, hostel, apartament, etc

  @Column({ type: 'integer' })
  stars: number; // 1-5

  @Column({ type: 'varchar', array: true, default: [] })
  amenities: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  checkInTime: number; // hora em formato decimal (14.5 = 14:30)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  checkOutTime: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  owner: User;

  @Column({ type: 'uuid' })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
