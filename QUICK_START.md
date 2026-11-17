# 🚀 Quick Start

## Local Development

```bash
# 1. Clone
git clone https://github.com/seu-usuario/hotel-management-system.git
cd hotel-management-system

# 2. Setup
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start
docker-compose up -d

# 4. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# RabbitMQ: http://localhost:15672
```

## Backend Development

```bash
cd backend
npm install
npm run dev      # Hot reload mode
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Lint code
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev      # Hot reload mode
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Lint code
```

## First Commit

```bash
git add .gitattributes backend/Dockerfile frontend/Dockerfile frontend/nginx.conf
git commit -m "chore: Add Docker configs and development guides

- Add backend/Dockerfile with multi-stage build
- Add frontend/Dockerfile and nginx.conf
- Add .gitattributes for LF normalization
- Add DEVELOPMENT.md with coding standards

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

## Push to GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/hotel-management-system.git
git branch -M main
git push -u origin main
```

## Next Steps

1. Create GitHub repo (https://github.com/new)
2. Push code
3. Buy VPS (Linode, DigitalOcean, AWS, etc)
4. Follow DEPLOY_GITHUB.md for production setup

---

**You're all set!** 🎉
