# 🔐 Política de Segurança

## Relatando Vulnerabilidades

**NÃO abra um GitHub Issue público** para vulnerabilidades de segurança.

Em vez disso:
1. Email: `security@hotelmanagement.local`
2. Descreva a vulnerabilidade em detalhes
3. Inclua passos para reproduzir (se possível)
4. Aguarde resposta em até 48h

Nós valorizamos sua responsabilidade e trabalharemos juntos para resolver rapidamente.

---

## 🛡️ Melhores Práticas de Segurança

### 1. Autenticação & Autorização

#### JWT (JSON Web Tokens)
```typescript
// ✅ BOM - Tokens com expiração
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '15m', // Expiração curta
  algorithm: 'HS256',
});

// ❌ RUIM
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

#### Refresh Tokens
```typescript
// Implementar refresh token rotation
// - Tokens curtos (15min)
// - Refresh tokens longos (7 dias)
// - Invalidar refresh tokens ao fazer logout
```

#### Rate Limiting
```typescript
// Use helmet + express-rate-limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // max 100 requisições por window
  message: 'Too many requests from this IP',
}));
```

### 2. Validação de Entrada

#### DTOs (Data Transfer Objects)
```typescript
// ✅ BOM
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// No controller
@Post()
async create(@Body(ValidationPipe) dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

#### Sanitização
```typescript
// Sanitizar entrada para prevenir XSS
import sanitizeHtml from 'sanitize-html';

const cleanInput = sanitizeHtml(userInput);
```

### 3. Criptografia

#### Senhas
```typescript
// Use bcrypt, NEVER plaintext
import * as bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

#### Dados Sensíveis
```typescript
// Use AES-256 para dados sensíveis em banco
import crypto from 'crypto';

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}
```

### 4. CORS & Headers

```typescript
// ✅ BOM
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet()); // Adiciona headers de segurança
```

### 5. SQL Injection Prevention

```typescript
// ✅ BOM - Use ORM (TypeORM)
const user = await this.userRepository.findOne({
  where: { id, email },
});

// ✅ TAMBÉM BOM - Use prepared statements
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ RUIM - String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

### 6. HTTPS & TLS

```bash
# Em produção, SEMPRE use HTTPS
# Use certificados Let's Encrypt (gratuito)

# Redirect HTTP → HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### 7. Logging & Auditoria

```typescript
// NÃO registre dados sensíveis
logger.info('User login', { userId: user.id }); // ✅ OK
logger.info('User login', { password: user.password }); // ❌ NUNCA!

// Registre ações críticas
logger.warn('Multiple failed login attempts', { userId, count: 5 });
logger.info('Database backup completed', { timestamp });
logger.error('Payment processing failed', { error: err.message });
```

### 8. Dependências

```bash
# Sempre verifique vulnerabilidades
npm audit
npm audit fix

# Use versões pinadas (ou ranges seguros)
# package.json - ✅ BOM
"express": "^4.18.0"  # Aceita 4.18.x mas não 5.x

# ❌ RUIM
"express": "*"        # Aceita qualquer versão
```

### 9. Variáveis de Ambiente

```bash
# .env.example (commitar)
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=your-secret-key-here
API_KEY_BOOKING=xxx

# .env (NÃO commitar)
DATABASE_URL=postgresql://user:$secure_pass@prod-db/hotel_db
JWT_SECRET=$complex_random_secret_key
API_KEY_BOOKING=$real_booking_key
```

### 10. CORS & CSRF

```typescript
// Proteção CSRF
import { CsrfMiddleware } from '@nestjs/csrf';

@Module({
  imports: [CsrfMiddleware],
})
export class AppModule {}

// SameSite cookies
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutos
});
```

---

## 📋 Checklist de Segurança (Pull Request)

- [ ] Sem hardcoded secrets/keys/passwords
- [ ] Validação de entrada em todos os DTOs
- [ ] Autorização verificada (roles/permissions)
- [ ] SQL Injection prevention (use ORM)
- [ ] XSS prevention (sanitizar saída)
- [ ] Rate limiting em endpoints críticos
- [ ] Logging sem dados sensíveis
- [ ] Testes de segurança cobrindo edge cases
- [ ] Dependências atualizadas
- [ ] Sem `eval()`, `exec()`, ou `Function()`

---

## 🚀 Deployment Security

### Produção
1. **HTTPS**: SSL/TLS obrigatório
2. **Secrets**: Use AWS Secrets Manager, Google Cloud Secret Manager, etc
3. **Firewall**: Restrinja IPs conhecidos
4. **WAF**: Web Application Firewall ativado
5. **Backups**: Criptografados, testados regularmente
6. **Logs**: Centralizados (Datadog, New Relic, Splunk)
7. **Monitoring**: Alertas para atividades suspeitas

### Docker
```dockerfile
# ✅ BOM
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
WORKDIR /app
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --chown=nestjs:nodejs package*.json ./
RUN npm ci --only=production
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]

# ❌ RUIM
FROM node:latest
COPY . .
RUN npm install
CMD ["npm", "start"]  # Roda como root!
```

---

## 🔄 Atualizações de Segurança

- [ ] Checagem automática de vulnerabilidades (Dependabot)
- [ ] Atualizações rápidas (< 24h para patches críticos)
- [ ] Versioning semântico
- [ ] Changelog mantido

---

## 📞 Contato

**Security Team**: `security@hotelmanagement.local`
**Resposta esperada**: 48 horas máximo

---

**Sua segurança é nossa prioridade.** 🔒
