import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsString()
  zipCode!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalRooms!: number;

  @IsNotEmpty()
  @IsString()
  propertyType!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number = 3;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsNumber()
  checkInTime: number = 14;

  @IsNumber()
  checkOutTime: number = 11;
}
