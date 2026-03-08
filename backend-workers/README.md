# Backend Workers (v3)

## Требования
- Node.js 20+
- Docker (Postgres + Redis)
- Playwright скачает браузеры при установке

## Setup
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run build
```

## Run
```bash
npm start
```
