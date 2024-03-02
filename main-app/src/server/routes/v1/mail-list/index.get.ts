import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default defineEventHandler(async () => {
  const mailList = await prisma.mailList.findMany();
  prisma.$disconnect();
  return mailList;
});
