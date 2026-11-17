# 🎨 Hotel Management System - Frontend

Frontend desenvolvido com **React 18**, **TypeScript**, **Material-UI** e **Redux Toolkit**.

## 📁 Estrutura

```
src/
├── components/
│   ├── common/              (Layout, Header, etc)
│   └── features/            (Feature-specific components)
├── pages/                   (Page components)
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Properties.tsx
│   └── Reservations.tsx
├── services/                (API client & services)
│   ├── api.ts              (Axios instance)
│   ├── authService.ts
│   ├── propertyService.ts
│   └── reservationService.ts
├── store/                   (Redux state management)
│   ├── slices/             (Redux slices)
│   ├── hooks/              (Redux hooks)
│   └── store.ts            (Store configuration)
├── types/                   (TypeScript types)
├── styles/                  (Global styles)
└── utils/                   (Utility functions)
```

## 🛠️ Setup

```bash
# 1. Instalar dependências
npm install

# 2. Copiar ambiente
cp .env.example .env

# 3. Iniciar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

## 🚀 Desenvolvimento

```bash
# Hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Formato
npm run format

# Testes
npm run test
```

## 📱 Features

- ✅ Autenticação com JWT
- ✅ Dashboard com estatísticas
- ✅ Gestão de propriedades (CRUD)
- ✅ Visualização de reservas
- ✅ Estado global com Redux
- ✅ Material-UI design system
- ✅ Responsive design
- ✅ Dark/Light mode ready

## 🎯 Componentes Principais

- **Layout**: Navbar + Sidebar com menu
- **Login**: Autenticação com JWT
- **Dashboard**: Overview com estatísticas
- **Properties**: CRUD de hotéis
- **Reservations**: Tabela de reservas

---

**Status**: ✅ MVP em desenvolvimento
