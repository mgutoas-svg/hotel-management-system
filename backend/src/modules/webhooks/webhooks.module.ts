import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook]), HttpModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
