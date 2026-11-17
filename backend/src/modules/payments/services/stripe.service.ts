import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from '../entities/payment.entity';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string, reservationId: string, guestEmail: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          reservationId,
          guestEmail,
        },
        receipt_email: guestEmail,
      });

      // Salvar payment
      const payment = this.paymentRepository.create({
        reservationId,
        amount,
        currency,
        paymentMethod: 'stripe',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
      });

      await this.paymentRepository.save(payment);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentId: payment.id,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        const payment = await this.paymentRepository.findOne({
          where: { stripePaymentIntentId: paymentIntentId },
        });

        if (payment) {
          payment.status = 'completed';
          payment.transactionId = paymentIntent.charges.data[0]?.id;
          await this.paymentRepository.save(payment);

          // Gerar invoice
          await this.generateInvoice(payment);

          return { success: true, payment };
        }
      }

      return { success: false, status: paymentIntent.status };
    } catch (error) {
      throw new BadRequestException(`Failed to confirm payment: ${error.message}`);
    }
  }

  async refundPayment(paymentId: string, amount?: number) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

      if (!payment || !payment.transactionId) {
        throw new BadRequestException('Payment not found');
      }

      const refundAmount = amount ? Math.round(amount * 100) : Math.round(payment.amount * 100);

      const refund = await this.stripe.refunds.create({
        charge: payment.transactionId,
        amount: refundAmount,
      });

      payment.isRefunded = true;
      payment.refundedAmount = refundAmount / 100;
      payment.refundedAt = new Date();
      payment.status = 'refunded';

      await this.paymentRepository.save(payment);

      return { success: true, refund };
    } catch (error) {
      throw new BadRequestException(`Failed to refund payment: ${error.message}`);
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

  async getPaymentHistory(reservationId: string) {
    return this.paymentRepository.find({ where: { reservationId } });
  }
}
