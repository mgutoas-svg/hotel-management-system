# 🏨 Hotel Management System

Sistema completo de gestão hoteleira com integração de múltiplos canais de reserva (Booking, Airbnb, Expedia, etc), construído com melhores práticas de desenvolvimento, segurança e escalabilidade.

## 🎯 Visão Geral

**Hotel Management System** é uma plataforma enterprise para gerenciar:

- ✅ Múltiplas propriedades hoteleiras
- ✅ Integração com Booking, Airbnb, Expedia, TripAdvisor
- ✅ Sincronização em tempo real de disponibilidade e preços
- ✅ Gestão de reservas, check-in/check-out
- ✅ Gestão de hóspedes e histórico
- ✅ Relatórios e analytics
- ✅ Painel de controle unificado (dashboard)

## 📊 Stack Tecnológico

### Backend
- **Linguagem**: Node.js + TypeScript
- **Framework**: NestJS (arquitetura modular, escalável)
- **Banco de Dados**: PostgreSQL + Redis
- **ORM**: TypeORM
- **API**: REST + GraphQL
- **Autenticação**: JWT + OAuth2

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Build Tool**: Vite
- **Responsivo**: Mobile-first

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: AWS/Google Cloud ready
- **Message Queue**: RabbitMQ (integração de canais)

## 📁 Estrutura do Projeto

```
hotel-management-system/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── properties/    # Propriedades/hotéis
│   │   │   ├── reservations/  # Reservas
│   │   │   ├── channels/      # Integração de canais
│   │   │   ├── guests/        # Hóspedes
│   │   │   ├── analytics/     # Relatórios
│   │   │   └── sync/          # Sincronização
│   │   ├── common/            # DTOs, Guards, Pipes
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # API client
│   │   ├── store/             # Redux state
│   │   ├── styles/            # Temas globais
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml         # Orquestração local
├── CONTRIBUTING.md            # Guia de contribuição
├── SECURITY.md                # Política de segurança
└── docs/                       # Documentação completa
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (ou via Docker)
- Git

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hotel-management-system.git
cd hotel-management-system

# Levante a infraestrutura (PostgreSQL, Redis, etc)
docker-compose up -d

# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (novo terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:3000` (frontend) e `http://localhost:3001/api` (backend).

## 🔐 Segurança

- Autenticação JWT com refresh tokens
- Rate limiting em todos os endpoints
- CORS configurado corretamente
- Validação de entrada em todos os DTOs
- Senhas hasheadas com bcrypt
- SQL injection prevention via ORM
- HTTPS em produção
- Secrets em variáveis de ambiente

Veja [SECURITY.md](./SECURITY.md) para detalhes completos.

## 📚 Documentação

- [Arquitetura do Sistema](./docs/ARCHITECTURE.md)
- [Guia de API](./docs/API.md)
- [Integração de Canais](./docs/CHANNELS.md)
- [Deploy & DevOps](./docs/DEVOPS.md)

## 🧪 Testes

```bash
# Backend
cd backend
npm run test              # Testes unitários
npm run test:e2e          # Testes end-to-end
npm run test:cov          # Cobertura

# Frontend
cd frontend
npm run test              # Jest
npm run test:e2e          # Cypress
```

## 📖 Workflow de Desenvolvimento

1. **Branch**: `git checkout -b feat/feature-name`
2. **Código**: Implemente com testes
3. **Commit**: `git commit -m "feat: descrição clara"`
4. **Push & PR**: Abra um Pull Request
5. **Review**: Mínimo 2 aprovações
6. **Merge**: Após aprovação, merge para `main`

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

## 📊 Roadmap

- **MVP (v0.1)**: Gestão básica de propriedades e reservas
- **v0.2**: Integração Booking + Airbnb
- **v0.3**: Analytics e relatórios avançados
- **v0.4**: Mobile app (React Native)
- **v1.0**: Release production ready

## 📄 Licença

MIT © 2026

## 📞 Suporte

- Issues: GitHub Issues
- Discussões: GitHub Discussions
- Email: dev@hotelmanagement.local

---

**Desenvolvido com ❤️ para hoteleiros modernos.**
