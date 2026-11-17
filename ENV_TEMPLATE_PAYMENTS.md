# .env Template para Backend (Copiar e colar em backend/.env)

```bash
# ============================================================
# DATABASE
# ============================================================
DATABASE_URL=postgresql://admin:password123@postgres:5432/hotel_management
DB_USER=admin
DB_PASSWORD=password123
DB_NAME=hotel_management

# ============================================================
# JWT
# ============================================================
JWT_SECRET=change-me-in-production-with-secure-32-char-string
JWT_EXPIRATION=900

# ============================================================
# REDIS & RABBITMQ
# ============================================================
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

# ============================================================
# EXTERNAL APIs (Booking, Airbnb)
# ============================================================
BOOKING_API_KEY=seu-booking-api-key
AIRBNB_API_KEY=seu-airbnb-api-key

# ============================================================
# STRIPE PAYMENTS
# Get from: https://dashboard.stripe.com/apikeys
# ============================================================
STRIPE_PUBLIC_KEY=pk_test_... (ou pk_live_...)
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_... (gere no painel de webhooks)

# ============================================================
# PAYPAL PAYMENTS
# Get from: https://developer.paypal.com
# ============================================================
PAYPAL_CLIENT_ID=seu-client-id
PAYPAL_SECRET=seu-secret
PAYPAL_MODE=sandbox

# ============================================================
# EMAIL (Nodemailer)
# Gmail: https://myaccount.google.com/apppasswords
# ============================================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app-16-caracteres
EMAIL_FROM=noreply@hotelmanagement.com

# ============================================================
# CORS & ENVIRONMENT
# ============================================================
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 🧪 Cartões de Teste

**Stripe Sandbox:**
- Número: `4242 4242 4242 4242`
- Vencimento: `12/25`
- CVC: `123`

**PayPal Sandbox:**
- Email: Seu usuário do PayPal Developer + `+facilitator`
- Senha: Configurada em `https://developer.paypal.com`
