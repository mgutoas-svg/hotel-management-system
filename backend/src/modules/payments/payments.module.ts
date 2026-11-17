import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Invoice]), HttpModule],
  providers: [StripeService, PayPalService],
  controllers: [PaymentsController],
  exports: [StripeService, PayPalService],
})
export class PaymentsModule {}
