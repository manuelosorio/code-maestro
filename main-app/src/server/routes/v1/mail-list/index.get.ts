import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @api {get} api/v1/mail-lists
 * @apiDescription Get all mail lists
 * @apiSuccess {Object[]} mailList - List of mail lists
 */
export default defineEventHandler(async () => {
  const mailList = await prisma.mailList.findMany();
  prisma.$disconnect();
  return mailList;
});
