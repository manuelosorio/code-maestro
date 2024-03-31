import { defineEventHandler, getRouterParam } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user_id = getRouterParam(event, 'id');
  return prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      id: user_id,
    },
  });
});
