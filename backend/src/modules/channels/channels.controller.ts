import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from './services/booking.service';
import { AirbnbService } from './services/airbnb.service';

@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly airbnbService: AirbnbService,
  ) {}

  @Post('booking/sync')
  @UseGuards(JwtAuthGuard)
  async syncBooking(@Body() { propertyId, externalPropertyId }: { propertyId: string; externalPropertyId: string }) {
    return this.bookingService.syncReservations(propertyId, externalPropertyId);
  }

  @Get('booking/availability/:externalPropertyId')
  @UseGuards(JwtAuthGuard)
  async getBookingAvailability(
    @Param('externalPropertyId') externalPropertyId: string,
    @Body() { startDate, endDate }: { startDate: string; endDate: string },
  ) {
    return this.bookingService.getAvailability(externalPropertyId, new Date(startDate), new Date(endDate));
  }

  @Post('booking/price')
  @UseGuards(JwtAuthGuard)
  async updateBookingPrice(
    @Body() { externalPropertyId, roomType, price, date }: { externalPropertyId: string; roomType: string; price: number; date: string },
  ) {
    return this.bookingService.updatePrice(externalPropertyId, roomType, price, new Date(date));
  }

  @Post('airbnb/sync')
  @UseGuards(JwtAuthGuard)
  async syncAirbnb(@Body() { propertyId, externalListingId }: { propertyId: string; externalListingId: string }) {
    return this.airbnbService.syncListings(propertyId, externalListingId);
  }

  @Get('airbnb/reservations/:externalListingId')
  @UseGuards(JwtAuthGuard)
  async getAirbnbReservations(
    @Param('externalListingId') externalListingId: string,
    @Body() { startDate, endDate }: { startDate: string; endDate: string },
  ) {
    return this.airbnbService.getReservations(externalListingId, new Date(startDate), new Date(endDate));
  }

  @Post('airbnb/availability')
  @UseGuards(JwtAuthGuard)
  async updateAirbnbAvailability(
    @Body() { externalListingId, available, blockedDates }: { externalListingId: string; available: boolean; blockedDates?: string[] },
  ) {
    return this.airbnbService.updateAvailability(
      externalListingId,
      available,
      blockedDates?.map((d) => new Date(d)),
    );
  }
}
