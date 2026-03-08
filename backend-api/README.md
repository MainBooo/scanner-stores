# Backend API (v3)

## Требования
- Node.js 20+
- Docker (Postgres + Redis)

## Setup
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:push
```

## Run (dev)
```bash
npm run dev
```
Health: http://localhost:4000/api/health
