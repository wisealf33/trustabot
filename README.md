# TrustaBot Checkout MVP

Self-custody crypto checkout prototype for TrustaBot.

## Stack
- Next.js + TypeScript
- Prisma + Postgres

## Implemented in this milestone
- `POST /api/invoices` (create invoice)
- `GET /api/invoices/:id` (fetch invoice status)
- Checkout UI with token dropdown
- Prisma schema for products/invoices/payments/deliveries
- Dev seed endpoint to create `crypto-starter-pack`

## Supported assets (Phase 1)
- BTC
- LTC
- ETH
- BNB
- USDC (ERC-20 / BEP-20)
- USDT (ERC-20 / BEP-20)

## Quick Start
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Set `DATABASE_URL` in `.env`
3. Generate Prisma client + push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start app:
   ```bash
   npm run dev
   ```
5. Seed product (dev only):
   ```bash
   curl -X POST http://localhost:3000/api/dev/seed
   ```
6. Open checkout:
   - http://localhost:3000

## Notes
- Address generation and chain watchers are currently mocked/placeholders.
- Next milestone adds real address derivation + watcher services + confirmation state transitions.
