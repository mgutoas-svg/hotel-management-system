import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { propertyId, checkInDate, checkOutDate, numberOfRooms } = createReservationDto;

    // Validar que propriedade existe
    const property = await this.propertiesService.findById(propertyId);

    // Validar datas
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      throw new BadRequestException('Check-in date must be before check-out date');
    }

    // Validar disponibilidade (overbooking prevention)
    const overlappingReservations = await this.reservationRepository.find({
      where: {
        propertyId,
        status: 'confirmed',
        checkInDate: Between(new Date(checkInDate), new Date(checkOutDate)),
      },
    });

    const totalRoomsBooked = overlappingReservations.reduce((sum, res) => sum + res.numberOfRooms, 0);

    if (totalRoomsBooked + numberOfRooms > property.totalRooms) {
      throw new ConflictException(
        `Only ${property.totalRooms - totalRoomsBooked} rooms available for the requested dates`,
      );
    }

    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async findById(id: string) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async findByProperty(propertyId: string, filters?: { status?: string; skip?: number; take?: number }) {
    const query = this.reservationRepository.createQueryBuilder('res').where('res.propertyId = :propertyId', {
      propertyId,
    });

    if (filters?.status) {
      query.andWhere('res.status = :status', { status: filters.status });
    }

    const take = filters?.take || 50;
    const skip = filters?.skip || 0;

    return await query.skip(skip).take(take).getMany();
  }

  async updateStatus(id: string, status: string) {
    const reservation = await this.findById(id);
    reservation.status = status;
    return await this.reservationRepository.save(reservation);
  }

  async getOccupancyReport(propertyId: string, startDate: Date, endDate: Date) {
    const reservations = await this.reservationRepository.find({
      where: {
        propertyId,
        status: 'confirmed',
        checkInDate: Between(startDate, endDate),
      },
    });

    return {
      propertyId,
      totalReservations: reservations.length,
      totalRoomsBooked: reservations.reduce((sum, res) => sum + res.numberOfRooms, 0),
      totalRevenue: reservations.reduce((sum, res) => sum + parseFloat(res.totalPrice.toString()), 0),
      reservations,
    };
  }
}
