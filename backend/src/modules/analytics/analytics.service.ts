import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async getRevenueReport(propertyId: string, startDate: Date, endDate: Date) {
    const reservations = await this.reservationRepository.find({
      where: {
        propertyId,
        status: 'confirmed',
        checkInDate: Between(startDate, endDate),
      },
    });

    const totalRevenue = reservations.reduce((sum, res) => sum + parseFloat(res.totalPrice.toString()), 0);
    const avgRevenue = reservations.length > 0 ? totalRevenue / reservations.length : 0;

    return {
      propertyId,
      period: { startDate, endDate },
      totalReservations: reservations.length,
      totalRevenue,
      avgRevenuePerReservation: avgRevenue,
      currency: 'BRL',
    };
  }

  async getOccupancyReport(propertyId: string, startDate: Date, endDate: Date) {
    const reservations = await this.reservationRepository.find({
      where: {
        propertyId,
        status: 'confirmed',
        checkInDate: Between(startDate, endDate),
      },
    });

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalRoomDays = 0; // Calculate based on property
    const occupiedRoomDays = reservations.reduce((sum, res) => {
      const daysBooked = Math.ceil((res.checkOutDate.getTime() - res.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + daysBooked * res.numberOfRooms;
    }, 0);

    return {
      propertyId,
      period: { startDate, endDate },
      totalDays: days,
      occupiedRoomDays,
      occupancyRate: totalRoomDays > 0 ? (occupiedRoomDays / totalRoomDays) * 100 : 0,
      reservations: reservations.length,
    };
  }
}
