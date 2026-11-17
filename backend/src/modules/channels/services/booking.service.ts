import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelSync } from '../entities/channel-sync.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  private readonly bookingApiUrl = 'https://distribution-xml.booking.com/json/bookings';
  private readonly bookingApiKey = process.env.BOOKING_API_KEY;
  private readonly bookingApiSecret = process.env.BOOKING_API_SECRET;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ChannelSync)
    private readonly channelSyncRepository: Repository<ChannelSync>,
  ) {}

  async syncReservations(propertyId: string, externalPropertyId: string) {
    try {
      // Buscar reservas do Booking
      const response = await firstValueFrom(
        this.httpService.get(`${this.bookingApiUrl}`, {
          params: {
            hotel_ids: externalPropertyId,
            key: this.bookingApiKey,
            secret: this.bookingApiSecret,
          },
        }),
      );

      const bookings = response.data.rpc?.bookings || [];
      
      // Atualizar sync info
      let sync = await this.channelSyncRepository.findOne({
        where: { propertyId, channel: 'booking' },
      });

      if (!sync) {
        sync = this.channelSyncRepository.create({
          propertyId,
          channel: 'booking',
          externalPropertyId,
          isActive: true,
        });
      }

      sync.lastSyncedAt = new Date();
      sync.syncCount += 1;
      await this.channelSyncRepository.save(sync);

      return {
        channel: 'booking',
        synced: bookings.length,
        bookings,
        lastSync: new Date(),
      };
    } catch (error) {
      throw new HttpException(`Booking sync failed: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getAvailability(externalPropertyId: string, startDate: Date, endDate: Date) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.bookingApiUrl}/availability`, {
          params: {
            hotel_ids: externalPropertyId,
            startdate: this.formatDate(startDate),
            enddate: this.formatDate(endDate),
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch availability', HttpStatus.BAD_REQUEST);
    }
  }

  async updatePrice(externalPropertyId: string, roomType: string, price: number, date: Date) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.bookingApiUrl}/prices`, {
          hotel_id: externalPropertyId,
          room_type: roomType,
          date: this.formatDate(date),
          price,
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to update price', HttpStatus.BAD_REQUEST);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
