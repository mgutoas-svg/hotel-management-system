import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelSync } from '../entities/channel-sync.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AirbnbService {
  private readonly airbnbApiUrl = 'https://api.airbnb.com/v2';
  private readonly airbnbAccessToken = process.env.AIRBNB_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ChannelSync)
    private readonly channelSyncRepository: Repository<ChannelSync>,
  ) {}

  async syncListings(propertyId: string, externalListingId: string) {
    try {
      // Buscar dados do anúncio
      const response = await firstValueFrom(
        this.httpService.get(`${this.airbnbApiUrl}/listings/${externalListingId}`, {
          headers: {
            Authorization: `Bearer ${this.airbnbAccessToken}`,
          },
        }),
      );

      const listing = response.data.listing;

      // Atualizar sync info
      let sync = await this.channelSyncRepository.findOne({
        where: { propertyId, channel: 'airbnb' },
      });

      if (!sync) {
        sync = this.channelSyncRepository.create({
          propertyId,
          channel: 'airbnb',
          externalPropertyId: externalListingId,
          isActive: true,
        });
      }

      sync.lastSyncedAt = new Date();
      sync.syncCount += 1;
      await this.channelSyncRepository.save(sync);

      return {
        channel: 'airbnb',
        listing,
        lastSync: new Date(),
      };
    } catch (error) {
      throw new HttpException(`Airbnb sync failed: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getReservations(externalListingId: string, startDate: Date, endDate: Date) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.airbnbApiUrl}/listings/${externalListingId}/reservations`, {
          params: {
            start_date: this.formatDate(startDate),
            end_date: this.formatDate(endDate),
          },
          headers: {
            Authorization: `Bearer ${this.airbnbAccessToken}`,
          },
        }),
      );

      return response.data.reservations;
    } catch (error) {
      throw new HttpException('Failed to fetch Airbnb reservations', HttpStatus.BAD_REQUEST);
    }
  }

  async updateAvailability(externalListingId: string, available: boolean, blockedDates?: Date[]) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.airbnbApiUrl}/listings/${externalListingId}/availability`,
          {
            available,
            blocked_dates: blockedDates?.map((d) => this.formatDate(d)),
          },
          {
            headers: {
              Authorization: `Bearer ${this.airbnbAccessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to update Airbnb availability', HttpStatus.BAD_REQUEST);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
