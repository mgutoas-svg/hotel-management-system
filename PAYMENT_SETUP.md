# 💳 Configuração de Pagamentos - Stripe & PayPal

## 🔧 Passo 1: Obter Chaves Stripe

### No Painel Stripe (https://dashboard.stripe.com)

1. Vá para **Developers** → **API Keys**
2. Copie:
   - **Publishable key** (começa com `pk_live_` ou `pk_test_`)
   - **Secret key** (começa com `sk_live_` ou `sk_test_`)

### Usar Sandbox Primeiro (Recomendado)
- Use `pk_test_...` e `sk_test_...`
- Cartão de teste: `4242 4242 4242 4242` | Vencimento: `12/25` | CVC: `123`

---

## 💰 Passo 2: Obter Chaves PayPal

### No Painel PayPal (https://developer.paypal.com)

1. Vá para **Apps & Credentials**
2. Selecione **Sandbox** (para testes)
3. Copie:
   - **Client ID** (Application ID)
   - **Secret**

### Conta PayPal Sandbox
- Email: seu-usuario+facilitator@paypal.com
- Senha: configurada no PayPal Developer

---

## 📝 Passo 3: Configurar `.env`

Copie este conteúdo para `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://admin:password123@postgres:5432/hotel_management
DB_USER=admin
DB_PASSWORD=password123
DB_NAME=hotel_management

# JWT
JWT_SECRET=seu-secret-key-super-seguro-aqui
JWT_EXPIRATION=900

# Redis
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

# APIs Externas
BOOKING_API_KEY=sua-chave-booking-aqui
AIRBNB_API_KEY=sua-chave-airbnb-aqui

# Stripe
STRIPE_PUBLIC_KEY=pk_test_... (ou pk_live_...)
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_... (gere depois via webhooks)

# PayPal
PAYPAL_CLIENT_ID=seu-client-id-aqui
PAYPAL_SECRET=seu-secret-aqui
PAYPAL_MODE=sandbox (mude para "live" em produção)

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app-aqui
EMAIL_FROM=noreply@hotelmanagement.com

# CORS
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 🧪 Passo 4: Testar Pagamentos

### Backend Rodando
```bash
cd backend
npm run dev
```

### Teste Stripe
```bash
curl -X POST http://localhost:3001/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-jwt-token" \
  -d '{
    "amount": 10000,
    "currency": "USD",
    "reservationId": "123"
  }'
```

### Teste PayPal
```bash
curl -X POST http://localhost:3001/api/payments/paypal/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-jwt-token" \
  -d '{
    "amount": "100.00",
    "currency": "USD",
    "reservationId": "123"
  }'
```

---

## 🔐 Passo 5: Webhooks (Produção)

### Stripe Webhooks
1. Painel Stripe → **Developers** → **Webhooks**
2. URL: `https://seu-dominio.com/api/payments/stripe/webhook`
3. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

### PayPal Webhooks
1. PayPal Developer → **Dashboard** → **Webhooks**
2. URL: `https://seu-dominio.com/api/payments/paypal/webhook`
3. Eventos: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`

---

## ✅ Checklist

- [ ] Chaves Stripe obtidas
- [ ] Chaves PayPal obtidas
- [ ] `.env` configurado com chaves
- [ ] Backend rodando: `npm run dev`
- [ ] Teste de pagamento Stripe OK
- [ ] Teste de pagamento PayPal OK
- [ ] Pronto para deploy em VPS

---

**Próximo**: Depois de confirmar que tudo funciona, fazemos `git push` para GitHub.
