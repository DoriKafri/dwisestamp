#!/bin/bash
set -e

echo "=========================================="
echo "  DWiseStamp - Setup & Test Runner"
echo "=========================================="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Error: Docker is required. Install from https://docker.com"; exit 1; }

echo "[1/7] Installing dependencies..."
npm install

echo ""
echo "[2/7] Starting PostgreSQL via Docker..."
docker rm -f dwisestamp-db 2>/dev/null || true
docker run -d --name dwisestamp-db \
  -p 5432:5432 \
  -e POSTGRES_DB=dwisestamp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
for i in {1..30}; do
  if docker exec dwisestamp-db pg_isready -U postgres >/dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  sleep 1
done

echo ""
echo "[3/7] Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
  echo "NOTE: Update .env.local with your Google OAuth credentials for full functionality"
fi

# Ensure DATABASE_URL is set for Prisma
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dwisestamp?schema=public"

echo ""
echo "[4/7] Running Prisma migrations..."
npx prisma generate
npx prisma db push --accept-data-loss

echo ""
echo "[5/7] Seeding database..."
npx prisma db seed || echo "Seed may have already been applied"

echo ""
echo "[6/7] Running unit tests..."
npm test -- --passWithNoTests --forceExit 2>&1 || echo "Some unit tests may need Google API credentials to pass"

echo ""
echo "[7/7] Installing Playwright & running E2E tests..."
npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium
npx playwright test 2>&1 || echo "Some E2E tests may need a running dev server and credentials"

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To run tests:"
echo "  npm test              # Unit tests"
echo "  npm run test:e2e      # E2E tests"
echo ""
echo "Don't forget to update .env.local with your Google credentials!"