import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Invoice } from '../entities/invoice.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayPalService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  private readonly mode = process.env.PAYPAL_MODE || 'sandbox';
  private readonly baseUrl = this.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/oauth2/token`,
          'grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      return response.data.access_token;
    } catch (error) {
      throw new BadRequestException('Failed to get PayPal access token');
    }
  }

  async createOrder(amount: number, currency: string, reservationId: string, description: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v2/checkout/orders`,
          {
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount.toFixed(2),
                },
                description,
              },
            ],
            payer: {
              email_address: 'guest@example.com',
            },
            application_context: {
              brand_name: 'Hotel Management System',
              return_url: `${process.env.FRONTEND_URL}/payment/success`,
              cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      const orderId = response.data.id;

      // Salvar payment
      const payment = this.paymentRepository.create({
        reservationId,
        amount,
        currency,
        paymentMethod: 'paypal',
        status: 'pending',
        paypalOrderId: orderId,
      });

      await this.paymentRepository.save(payment);

      return {
        orderId,
        paymentId: payment.id,
        approvalUrl: response.data.links.find((link) => link.rel === 'approve')?.href,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create PayPal order: ${error.message}`);
    }
  }

  async captureOrder(orderId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      if (response.data.status === 'COMPLETED') {
        const payment = await this.paymentRepository.findOne({
          where: { paypalOrderId: orderId },
        });

        if (payment) {
          payment.status = 'completed';
          payment.transactionId = response.data.purchase_units[0].payments.captures[0].id;
          await this.paymentRepository.save(payment);

          // Gerar invoice
          await this.generateInvoice(payment);

          return { success: true, payment };
        }
      }

      return { success: false, status: response.data.status };
    } catch (error) {
      throw new BadRequestException(`Failed to capture PayPal order: ${error.message}`);
    }
  }

  async refundCapture(captureId: string, amount?: number) {
    try {
      const accessToken = await this.getAccessToken();

      const refundData = amount ? { amount: { value: amount.toFixed(2), currency_code: 'USD' } } : {};

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, refundData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return { success: true, refund: response.data };
    } catch (error) {
      throw new BadRequestException(`Failed to refund PayPal payment: ${error.message}`);
    }
  }

  private async generateInvoice(payment: Payment) {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;

    const invoice = this.invoiceRepository.create({
      invoiceNumber,
      paymentId: payment.id,
      guestEmail: 'guest@example.com',
      guestName: 'Guest Name',
      subtotal: payment.amount,
      taxAmount: payment.amount * 0.1,
      taxRate: 10,
      totalAmount: payment.amount * 1.1,
      isPaid: true,
      paidAt: new Date(),
    });

    return this.invoiceRepository.save(invoice);
  }
}
