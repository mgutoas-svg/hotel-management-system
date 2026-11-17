# 💳 Payment Integration Guide

## Overview

This system integrates with both **Stripe** and **PayPal** for secure payment processing.

## Setup Instructions

### 1. Stripe Integration

#### Get Stripe API Keys
1. Go to https://dashboard.stripe.com
2. Navigate to Developers → API Keys
3. Copy your Publishable Key and Secret Key

#### Configure Backend
```bash
# In backend/.env
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

#### Install Stripe SDK
```bash
npm install stripe
```

#### Create Payment
```bash
POST /api/v1/payments/stripe/create-intent
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "amount": 1000,
  "currency": "USD",
  "reservationId": "res-123"
}

Response:
{
  "clientSecret": "pi_xxx_secret",
  "paymentIntentId": "pi_xxx",
  "paymentId": "pay-123"
}
```

#### Confirm Payment
```bash
POST /api/v1/payments/stripe/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx"
}
```

#### Refund Payment
```bash
POST /api/v1/payments/stripe/refund/:paymentId
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "amount": 500  # optional, full refund if omitted
}
```

---

### 2. PayPal Integration

#### Get PayPal API Credentials
1. Go to https://developer.paypal.com
2. Log in to your account
3. Create an app to get Client ID and Secret
4. Use Sandbox mode for testing

#### Configure Backend
```bash
# In backend/.env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
```

#### Create Order
```bash
POST /api/v1/payments/paypal/create-order
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "amount": 1000,
  "currency": "USD",
  "reservationId": "res-123",
  "description": "Hotel Reservation"
}

Response:
{
  "orderId": "7GH512345678",
  "paymentId": "pay-456",
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=..."
}
```

#### Capture Order (after user approves)
```bash
POST /api/v1/payments/paypal/capture/:orderId
Content-Type: application/json

Response: Payment confirmed
```

#### Refund
```bash
POST /api/v1/payments/paypal/refund/:captureId
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "amount": 500  # optional
}
```

---

### 3. Database

Two new tables are automatically created:

#### payments
- id (UUID)
- reservationId (UUID)
- amount (Decimal)
- currency (VARCHAR)
- paymentMethod (VARCHAR: stripe/paypal)
- status (VARCHAR: pending/completed/failed/refunded)
- transactionId (VARCHAR)
- stripePaymentIntentId (VARCHAR - nullable)
- paypalOrderId (VARCHAR - nullable)
- invoiceNumber (VARCHAR - nullable)
- isRefunded (BOOLEAN)
- refundedAmount (Decimal - nullable)
- refundedAt (TIMESTAMP - nullable)

#### invoices
- id (UUID)
- invoiceNumber (VARCHAR - unique)
- paymentId (UUID)
- guestEmail (VARCHAR)
- guestName (VARCHAR)
- subtotal (Decimal)
- taxAmount (Decimal)
- taxRate (Decimal)
- totalAmount (Decimal)
- isPaid (BOOLEAN)
- paidAt (TIMESTAMP - nullable)
- isSent (BOOLEAN)
- sentAt (TIMESTAMP - nullable)

---

### 4. Frontend Integration

#### Stripe Elements (Recommended for Web)
```bash
npm install @stripe/react-stripe-js @stripe/js
```

```tsx
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  };
}
```

#### PayPal Buttons (Recommended)
```bash
npm install @paypal/checkout-server-sdk @paypal/sdk-js
```

```tsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/checkout-server-sdk";

<PayPalButtons
  createOrder={(data, actions) => {
    // Call API to create order
  }}
  onApprove={(data, actions) => {
    // Call API to capture order
  }}
/>
```

---

### 5. Webhooks (Recommended)

Setup Stripe and PayPal webhooks to handle:
- Successful payments
- Failed payments
- Refunds
- Disputed charges

```bash
# Stripe Webhook Events
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded

# PayPal Webhook Events
- PAYMENT.SALE.COMPLETED
- PAYMENT.SALE.REFUNDED
- PAYMENT.SALE.DENIED
```

---

### 6. Testing

#### Stripe Test Cards
- Visa: 4242 4242 4242 4242
- MasterCard: 5555 5555 5555 4444
- Amex: 3782 822463 10005
- Use any future expiry date and any 3-digit CVC

#### PayPal Sandbox
Use your sandbox account credentials at https://sandbox.paypal.com

---

### 7. Security Best Practices

✅ **DO:**
- Use HTTPS for all payment transactions
- Never store credit card data (use tokenization)
- Validate amounts on backend
- Use idempotency keys for retries
- Implement rate limiting
- Log all payment events
- Keep API keys in environment variables

❌ **DON'T:**
- Send card details through API
- Expose secret keys to frontend
- Skip PCI compliance
- Store raw card data
- Use hardcoded API keys
- Log sensitive payment data

---

### 8. Deployment Checklist

- [ ] Update to production API keys
- [ ] Set PAYPAL_MODE=production
- [ ] Enable webhook verifications
- [ ] Test full payment flow
- [ ] Setup monitoring/alerts
- [ ] Configure email receipts
- [ ] Document refund policy
- [ ] Train support team

---

### 9. Support

For issues:
- Stripe: https://support.stripe.com
- PayPal: https://www.paypal.com/en/webapps/mpp/support
- Email: support@hotelmanagement.local
