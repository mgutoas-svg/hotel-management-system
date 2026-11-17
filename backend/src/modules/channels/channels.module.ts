import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelSync } from './entities/channel-sync.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelSync])],
})
export class ChannelsModule {}
