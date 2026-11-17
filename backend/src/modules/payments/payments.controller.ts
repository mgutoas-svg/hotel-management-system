import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
  ) {}

  // STRIPE ENDPOINTS
  @Post('stripe/create-intent')
  @UseGuards(JwtAuthGuard)
  async createStripeIntent(
    @Body() { amount, currency, reservationId }: { amount: number; currency: string; reservationId: string },
    @Req() req,
  ) {
    return this.stripeService.createPaymentIntent(amount, currency, reservationId, req.user.email);
  }

  @Post('stripe/confirm')
  async confirmStripePayment(@Body() { paymentIntentId }: { paymentIntentId: string }) {
    return this.stripeService.confirmPayment(paymentIntentId);
  }

  @Post('stripe/refund/:paymentId')
  @UseGuards(JwtAuthGuard)
  async refundStripePayment(@Param('paymentId') paymentId: string, @Body() { amount }: { amount?: number }) {
    return this.stripeService.refundPayment(paymentId, amount);
  }

  // PAYPAL ENDPOINTS
  @Post('paypal/create-order')
  @UseGuards(JwtAuthGuard)
  async createPayPalOrder(
    @Body() { amount, currency, reservationId, description }: { amount: number; currency: string; reservationId: string; description: string },
  ) {
    return this.paypalService.createOrder(amount, currency, reservationId, description);
  }

  @Post('paypal/capture/:orderId')
  async capturePayPalOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }

  @Post('paypal/refund/:captureId')
  @UseGuards(JwtAuthGuard)
  async refundPayPalPayment(@Param('captureId') captureId: string, @Body() { amount }: { amount?: number }) {
    return this.paypalService.refundCapture(captureId, amount);
  }

  // PAYMENT HISTORY
  @Get('history/:reservationId')
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@Param('reservationId') reservationId: string) {
    return this.stripeService.getPaymentHistory(reservationId);
  }
}
