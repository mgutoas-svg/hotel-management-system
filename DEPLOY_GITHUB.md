# 🚀 Deploy para GitHub + VPS

## ✅ PASSO 1: Criar Repositório no GitHub (Faça Agora)

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `hotel-management-system`
   - **Description**: Sistema de gestão hoteleira com integração Booking, Airbnb
   - **Public** ou **Private** (sua escolha)
   - **NÃO** inicialize com README/License/gitignore
3. Clique em "Create repository"
4. GitHub vai mostrar as instruções. Use as de baixo:

```bash
git remote add origin https://github.com/SEU_USUARIO/hotel-management-system.git
git branch -M main
git push -u origin main
```

---

## ✅ PASSO 2: Push para GitHub (Execute Aqui)

```bash
cd C:\hotel-management-system
git remote add origin https://github.com/SEU_USUARIO/hotel-management-system.git
git branch -M main
git push -u origin main
```

**Pronto!** Seu código está no GitHub.

---

## ✅ PASSO 3: Setup VPS para Deploy Automático

### Pré-requisitos na VPS:
- Ubuntu 22.04 LTS
- SSH configurado
- 2GB RAM mínimo
- 20GB disco

### Instalar no VPS:

```bash
# 1. SSH na VPS
ssh root@seu-vps-ip

# 2. Update do sistema
apt update && apt upgrade -y

# 3. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
docker --version

# 4. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version

# 5. Instalar Git
apt install -y git

# 6. Criar diretório do projeto
mkdir -p /app/hotel-management-system
cd /app/hotel-management-system

# 7. Clonar repositório
git clone https://github.com/SEU_USUARIO/hotel-management-system.git .

# 8. Copiar .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 9. Editar .env para produção (IMPORTANTE!)
nano backend/.env
# Mudar:
# - NODE_ENV=production
# - JWT_SECRET=gerar novo valor seguro
# - DATABASE_URL=apontar para DB externo (optional)
# - Adicionar chaves de API reais (Booking, Airbnb, etc)
```

---

## ✅ PASSO 4: Deploy com Docker Compose

```bash
cd /app/hotel-management-system

# Build das imagens
docker-compose build

# Iniciar containers
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar tudo
docker-compose down
```

---

## ✅ PASSO 5: Configurar Domínio + HTTPS

### Usar Nginx como Reverse Proxy + Let's Encrypt

```bash
# 1. Instalar Nginx
apt install -y nginx certbot python3-certbot-nginx

# 2. Criar config do Nginx
cat > /etc/nginx/sites-available/hotel-management << 'NGINX'
server {
    listen 80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

# 3. Ativar site
ln -s /etc/nginx/sites-available/hotel-management /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 4. Gerar SSL com Let's Encrypt
certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br

# Vai renovar automaticamente a cada 90 dias
```

---

## ✅ PASSO 6: Auto-Deploy com GitHub Actions

Criar arquivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /app/hotel-management-system
          git pull origin main
          docker-compose down
          docker-compose build
          docker-compose up -d
          echo "✅ Deploy concluído!"
```

Configure no GitHub:
- Settings → Secrets and variables → Actions
- Adicione:
  - `VPS_HOST`: IP da VPS
  - `VPS_USER`: root (ou outro usuário)
  - `VPS_SSH_KEY`: sua chave privada SSH

---

## ✅ PASSO 7: Monitoramento

### Logs em tempo real
```bash
docker-compose logs -f
```

### Ver containers rodando
```bash
docker ps
docker stats
```

### Reiniciar container específico
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Remover tudo (se needed)
```bash
docker-compose down -v
```

---

## 📊 Arquitetura Final na VPS

```
VPS (seu-dominio.com.br)
│
├── Nginx (porta 80, 443)
│   │
│   ├── Frontend: http://localhost:3000
│   │   └── React app
│   │
│   └── Backend API: http://localhost:3001
│       └── NestJS server
│
├── Docker Containers:
│   ├── PostgreSQL (porta 5432)
│   ├── Redis (porta 6379)
│   ├── RabbitMQ (porta 5672)
│   ├── Backend (porta 3001)
│   └── Frontend (porta 3000)
│
└── GitHub (Pull automático quando você faz push)
```

---

## 🔒 Segurança - Checklist

- [ ] JWT_SECRET alterado (backend/.env)
- [ ] NODE_ENV=production
- [ ] HTTPS ativado (Let's Encrypt)
- [ ] Firewall UFW configurado
- [ ] SSH key-based auth (sem password)
- [ ] Database backup automático
- [ ] Logs centralizados (optional)

---

## 💡 Próximas Etapas

1. ✅ GitHub: Push do código
2. ✅ VPS: Setup Docker + Deploy
3. ✅ Domínio: Apontado para VPS
4. ✅ HTTPS: Let's Encrypt configurado
5. ⏳ **Começar desenvolvimento**: Backend (NestJS) + Frontend (React)
6. ⏳ Integrar APIs: Booking, Airbnb, Expedia
7. ⏳ Testes e produção

---

**Pronto para ir à produção!** 🚀
