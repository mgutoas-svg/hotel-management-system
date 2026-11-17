# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Instalar dumb-init (melhor para gerenciar signals)
RUN apk add --no-cache dumb-init

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar build da etapa anterior
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Mudar para usuário não-root
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para melhor signal handling
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicialização
CMD ["node", "dist/main"]

EXPOSE 3001
