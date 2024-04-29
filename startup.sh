#!/bin/bash
  pnpm run prisma:generate
  pnpm exec prisma migrate deploy --schema main-app/prisma/schema.prisma
  pnpm exec prisma db seed


node dist/main-app/analog/server/index.mjs
