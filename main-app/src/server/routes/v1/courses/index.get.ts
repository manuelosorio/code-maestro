import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * @api {get} api/v1/courses
 * @apiDescription Get all courses
 * @apiSuccess {Object[]} course - List of courses
 */
export default defineEventHandler(async () => {
  const mailList = await prisma.course.findMany();
  prisma.$disconnect();
  return mailList;
});
