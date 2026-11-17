import { IsNotEmpty, IsString, IsDate, IsNumber, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  propertyId: string;

  @IsNotEmpty()
  @IsString()
  guestName: string;

  @IsNotEmpty()
  @IsEmail()
  guestEmail: string;

  @IsNotEmpty()
  @IsString()
  guestPhone: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;

  @IsNotEmpty()
  @IsNumber()
  numberOfGuests: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfRooms: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  currency?: string = 'BRL';

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed'])
  status?: string = 'pending';

  @IsOptional()
  @IsString()
  bookingSource?: string;

  @IsOptional()
  @IsString()
  externalBookingId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
