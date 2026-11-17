import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from '../entities/webhook.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>,
    private readonly httpService: HttpService,
  ) {}

  async createWebhook(event: string, url: string) {
    const webhook = this.webhookRepository.create({ event, url, isActive: true });
    return this.webhookRepository.save(webhook);
  }

  async getWebhooks(event: string) {
    return this.webhookRepository.find({ where: { event, isActive: true } });
  }

  async deliverWebhook(webhook: Webhook, payload: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(webhook.url, payload, { headers: { 'Content-Type': 'application/json' } }),
      );

      webhook.deliveredCount += 1;
      await this.webhookRepository.save(webhook);
      return { success: true, statusCode: response.status };
    } catch (error) {
      webhook.failedCount += 1;
      await this.webhookRepository.save(webhook);
      return { success: false, error: error.message };
    }
  }

  async triggerEvent(event: string, payload: any) {
    const webhooks = await this.getWebhooks(event);
    for (const webhook of webhooks) {
      this.deliverWebhook(webhook, payload);
    }
  }
}
