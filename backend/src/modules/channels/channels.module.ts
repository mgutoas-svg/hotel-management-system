import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelSync } from './entities/channel-sync.entity';
import { BookingService } from './services/booking.service';
import { AirbnbService } from './services/airbnb.service';
import { ChannelsController } from './channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelSync]), HttpModule],
  providers: [BookingService, AirbnbService],
  controllers: [ChannelsController],
  exports: [BookingService, AirbnbService],
})
export class ChannelsModule {}
