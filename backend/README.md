# 🚀 Hotel Management System - Backend

Backend API desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**.

## 📁 Estrutura

```
src/
├── modules/
│   ├── auth/           # Autenticação (JWT, Login, Registro)
│   ├── properties/     # Gestão de propriedades/hotéis
│   ├── reservations/   # Gestão de reservas (com validação de overbooking)
│   ├── guests/         # Perfil de hóspedes
│   ├── channels/       # Integração com Booking, Airbnb, etc
│   └── analytics/      # Relatórios e dashboards
├── common/
│   ├── decorators/     # Custom decorators
│   ├── guards/         # Auth guards
│   ├── pipes/          # Validation pipes
│   └── filters/        # Exception filters
├── config/             # Configurações (DB, etc)
├── app.module.ts       # Módulo raiz
└── main.ts            # Entry point
```

## 🛠️ Setup

```bash
# 1. Instalar dependências
npm install

# 2. Copiar ambiente
cp .env.example .env

# 3. Iniciar em desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build
npm run start
```

## 📚 Endpoints Principais

### Auth
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login
- `GET /auth/me` - Obter perfil (requer JWT)

### Properties
- `GET /properties` - Listar todas as propriedades
- `GET /properties/:id` - Obter propriedade
- `POST /properties` - Criar propriedade (requer JWT)
- `PUT /properties/:id` - Atualizar propriedade (requer JWT)
- `DELETE /properties/:id` - Deletar propriedade (requer JWT)
- `GET /properties/my-properties` - Minhas propriedades (requer JWT)

### Reservations
- `POST /reservations` - Criar reserva
- `GET /reservations/:id` - Obter reserva
- `GET /reservations/property/:propertyId` - Reservas de uma propriedade
- `PATCH /reservations/:id/status` - Atualizar status (requer JWT)
- `GET /reservations/property/:propertyId/occupancy` - Relatório de ocupação

## 🔐 Autenticação

Usar **JWT** nos headers:
```bash
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```

## 🚢 Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor
npm run start

# Ou usando Docker
docker build -t hotel-backend .
docker run -p 3001:3001 hotel-backend
```

---

**Status**: ✅ MVP em desenvolvimento
